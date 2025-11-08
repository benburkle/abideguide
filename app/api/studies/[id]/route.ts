import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let study = await prisma.study.findUnique({
      where: { id: parseInt(id) },
      include: {
        schedule: true,
        resource: true,
        guide: {
          include: {
            guideSteps: {
              orderBy: {
                index: 'asc',
              },
            },
          },
        },
        sessions: {
          orderBy: {
            date: 'desc',
          },
          include: {
            sessionSteps: {
              include: {
                guideStep: true,
              },
              orderBy: {
                guideStep: {
                  index: 'asc',
                },
              },
            },
            guideStep: true,
            selection: true,
          },
        },
      },
    });

    if (!study) {
      return NextResponse.json(
        { error: 'Study not found' },
        { status: 404 }
      );
    }

    // For each session without steps, create them from guide steps
    if (study.guide && study.guide.guideSteps.length > 0) {
      for (const session of study.sessions) {
        if (session.sessionSteps.length === 0) {
          await prisma.sessionStep.createMany({
            data: study.guide.guideSteps.map((guideStep) => ({
              sessionId: session.id,
              guideStepId: guideStep.id,
            })),
          });
        }
      }
    }

    // Fetch the study again to include newly created session steps
    study = await prisma.study.findUnique({
      where: { id: parseInt(id) },
      include: {
        schedule: true,
        resource: true,
        guide: {
          include: {
            guideSteps: {
              orderBy: {
                index: 'asc',
              },
            },
          },
        },
        sessions: {
          orderBy: {
            date: 'desc',
          },
          include: {
            sessionSteps: {
              include: {
                guideStep: true,
              },
              orderBy: {
                guideStep: {
                  index: 'asc',
                },
              },
            },
            guideStep: true,
            selection: true,
          },
        },
      },
    });

    return NextResponse.json(study);
  } catch (error) {
    console.error('Error fetching study:', error);
    return NextResponse.json(
      { error: 'Failed to fetch study', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, scheduleId, resourceId, guideId } = body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'Name is required', details: 'Name must be a non-empty string' },
        { status: 400 }
      );
    }

    if (!resourceId) {
      return NextResponse.json(
        { error: 'Resource ID is required', details: 'Resource ID must be provided' },
        { status: 400 }
      );
    }

    const parsedResourceId = parseInt(resourceId);
    if (isNaN(parsedResourceId)) {
      return NextResponse.json(
        { error: 'Invalid Resource ID', details: 'Resource ID must be a valid number' },
        { status: 400 }
      );
    }

    // Check if guide exists if provided
    if (guideId) {
      const parsedGuideId = parseInt(guideId);
      if (!isNaN(parsedGuideId)) {
        const guide = await prisma.guide.findUnique({
          where: { id: parsedGuideId },
        });

        if (!guide) {
          return NextResponse.json(
            { error: 'Guide not found', details: `Guide with ID ${parsedGuideId} does not exist` },
            { status: 404 }
          );
        }
      }
    }

    const study = await prisma.study.update({
      where: { id: parseInt(id) },
      data: {
        name: name.trim(),
        scheduleId: scheduleId ? parseInt(scheduleId) : null,
        resourceId: parsedResourceId,
        guideId: guideId ? parseInt(guideId) : null,
      },
      include: {
        schedule: true,
        resource: true,
        sessions: {
          orderBy: {
            date: 'desc',
          },
        },
      },
    });

    return NextResponse.json(study);
  } catch (error) {
    console.error('Error updating study:', error);
    return NextResponse.json(
      { error: 'Failed to update study', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.study.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting study:', error);
    return NextResponse.json(
      { error: 'Failed to delete study', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
