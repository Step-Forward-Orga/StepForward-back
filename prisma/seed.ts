import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient()

const seedUsers = async () => {
    const password = await bcrypt.hash('Password123', 10)

    const users = [
        { email: 'user1@example.com', username: 'user1', roles: [Role.USER] },
        { email: 'user2@example.com', username: 'user2', roles: [Role.USER] },
        { email: 'user3@example.com', username: 'user3', roles: [Role.USER] },
        { email: 'user4@example.com', username: 'user4', roles: [Role.USER] },
        { email: 'admin@example.com', username: 'admin', roles: [Role.ADMIN] },
    ]

    for (const user of users) {
        await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: {
                email: user.email,
                username: user.username,
                password,
                roles: user.roles,
            },
        })
    }
}

const EXERCISES = [
    {name : "Bench Press", description: "The bench press is performed as an upper-body exercise primarily targeting the pectoral muscles, and secondarily the triceps and shoulders. However, when performed correctly, it engages the entire body, including leg drive, core bracing, and stabilization of the shoulder girdle."},
    {name : "Dips", description: "Dips are one of the most underestimated strength training exercises. With the abundance of machines available to train the arms, shoulders, and chest, people often overlook certain bodyweight exercises that are nevertheless extremely effective."},
    {name : "Traction", description: "The pull-up is a classic exercise that targets the muscles of the upper back, particularly the latissimus dorsi."},
    {name : "Sited Machine Shoulder Press", description: "The shoulder press is an exercise that engages the shoulder muscles, the chest, the upper back, the triceps, and the core, which makes it a challenging exercise for beginners."},
    {name : "Hammer Curl", description: "Bigger and stronger arms are usually at the top of the priority list for people who practice strength training. For this purpose, the neutral-grip curl, or hammer curl, is an excellent exercise that helps develop the biceps while also having the advantage of working the forearms (the brachioradialis muscle)."},
    {name : "Squat", description: "The squat is the king of all exercises! Although it primarily targets the quadriceps, hamstrings, and glutes, it is said to engage more than 256 muscles. Whether you are a bodybuilder, powerlifter, or competitive athlete, the squat is an essential compound movement that should be part of any strength training program."},
    {name : "Sited Leg Extension", description: "The leg extension is an isolation exercise that targets the quadriceps, which are composed of four specific muscles located at the front of the thigh: the rectus femoris, the vastus lateralis, the vastus medialis, and the vastus intermedius."},
    {name : "Sited Leg Curl", description: "Whether performed seated or lying down, the leg curl (also called the hamstring curl) is one of the best ways to isolate, strengthen, and develop the hamstrings. This exercise not only helps increase lower-body strength, but also helps correct muscular imbalances with the quadriceps, prevent injuries, and improve performance in other strength training exercises."},
    {name : "Cable Triceps Pushdown", description: "A very popular exercise for developing the triceps, the cable triceps pushdown is a staple for building bigger and stronger arms. The advantage of this exercise is that it works all three heads of the triceps muscle."},
    {name : "Machine Hip Thrust", description: "If you are looking for a good exercise to work your glutes and the upper part of your legs, the hip thrust is ideal for your training program. Although you can perform this exercise with bodyweight or with a barbell, using a machine specifically designed for hip extension movements allows you to stay stable and train comfortably. Trying a new piece of gym equipment can feel intimidating if you have never used it before, but give this exercise a try—you might really enjoy it."},
    {name : "Machine Pec fly", description: ""},
    {name : "Flat Dumbbell chest press", description: ""},
    {name : "Tbar Row", description: ""},
    {name : "Lat PullDown", description: ""},
    {name : "Cable Y Raise", description: ""},
    {name : "Cable Lateral Raise", description: ""},
    {name : "Split Squat", description: ""},
    {name : "Horizontal Leg Press", description: ""},
    {name : "Sited Calf Raise", description: ""},
    {name : "Incline Smith Machine Chest Press", description: ""},
    {name : "Decline Dumbbell Chest Press", description: ""},
    {name : "Lat Pullover", description: ""},
    {name : "Romanian DeadLift (RDL)", description: ""},
    {name : "Leg Press", description: ""},
    {name : "Horizontal Press Calf Extensions", description: ""},
    {name : "Smith Machine Chest Press Close Grip", description: ""},
    {name : "Chest Press Close Grip", description: ""},
    {name : "LatPull Down Supination", description: ""},
    {name : "Dumbbell Skull Crusher", description: ""},
    {name : "Skull Crusher", description: ""},
    {name : "Preacher Curl", description: ""},
    {name : "Dumbbell Preacher Curl", description: ""},
    {name : "Cable Front Raise", description: ""},
    {name : "Bayesian Cable Curl", description: ""},
    {name : "Hack Squat", description: ""},
    {name : "Leg Curl (lying down)", description: ""},
    {name : "Adductors Machine", description: ""},
    {name : "Abductors Machine", description: ""},
    {name : "Smith Machine Calf Raise", description: ""},
    {name : "Cable Crunch", description: ""},
    {name : "Traction Supination", description: ""},
    {name : "Chin Rows", description: ""},
    {name : "Triceps Overhead Extension", description: ""},
    {name : "Decline Hammer Strength Uni", description: ""},
    {name : "High Pec Cable Fly", description: ""},
    {name : "Forearms", description: ""},
    {name : "Reverse Crunch", description: ""},
    {name : "Lombert", description: ""},
    {name : "Curl", description: ""},
    {name : "Deadlift", description: ""},
    {name : "Cable Rear Delt", description: ""},
    {name : "Bulgarian Split Squat", description: ""},
]

const WORKOUT_EXERCISES = [
    //sm incline press
    { exercise: "Incline Smith Machine Chest Press", restTime: "PT3M", workout: 0, 
        plannedSets: [
            { reps: 8, weight: 80, order: 1},
            { reps: 6, weight: 80, order: 2},
            { reps: 10, weight: 65, order: 3},
        ]
    },
    //lat pull down
    { exercise: "Lat PullDown", restTime: "PT3M", workout: 0,
        plannedSets: [
            { reps: 8, weight: 105, order: 1},
            { reps: 6, weight: 105, order: 2},
            { reps: 10, weight: 90, order: 3},
        ]
    },
    //decline db press
    { exercise: "Decline Dumbbell Chest Press", restTime: "PT3M", workout: 0,
        plannedSets: [
            { reps: 7, weight: 48, order: 1},
            { reps: 5, weight: 48, order: 2},
            { reps: 7, weight: 42, order: 3},
        ]
    },
    //tbar
    { exercise: "Tbar Row", restTime: "PT3M", workout: 0,
        plannedSets: [
            { reps: 7, weight: 90, order: 1},
            { reps: 6, weight: 90, order: 2},
            { reps: 10, weight: 75, order: 3},
        ]
    },
    //Machine pec fly
    { exercise: "Machine Pec fly", restTime: "PT3M", workout: 0,
        plannedSets: [
            { reps: 8, weight: 40, order: 1},
            { reps: 5, weight: 40, order: 2},
            { reps: 6, weight: 30, order: 3},
        ]
    },
    //Lat pullover
    { exercise: "Lat Pullover", restTime: "PT3M", workout: 0,
        plannedSets: [
            { reps: 6, weight: 32.5, order: 1},
            { reps: 5, weight: 32.5, order: 2},
            { reps: 10, weight: 25, order: 3},
        ]
    },
    // ! workout 2
    //Bulgarian Split Squat
    { exercise: "Bulgarian Split Squat", restTime: "PT3M", workout: 1,
        plannedSets: [
            { reps: 8, weight: 80, order: 1},
            { reps: 6, weight: 80, order: 2},
            { reps: 10, weight: 65, order: 3},
        ]
    },
    //Sited Leg Extension
    { exercise: "Sited Leg Extension", restTime: "PT3M", workout: 1,
        plannedSets: [
            { reps: 12, weight: 100, order: 1},
            { reps: 12, weight: 100, order: 2},
            { reps: 10, weight: 85, order: 3},
        ]
    },
    //Leg Press
    { exercise: "Leg Press", restTime: "PT3M", workout: 1,
        plannedSets: [
            { reps: 8, weight: 220, order: 1},
            { reps: 6, weight: 220, order: 2},
            { reps: 10, weight: 190, order: 3},
        ]
    },
    //Sited Leg Curl
    { exercise: "Sited Leg Curl", restTime: "PT3M", workout: 1,
        plannedSets: [
            { reps: 10, weight: 75, order: 1},
            { reps: 8, weight: 75, order: 2},
            { reps: 10, weight: 60, order: 3},
        ]
    },
    //Horizontal Press Calf Extensions
    { exercise: "Horizontal Press Calf Extensions", restTime: "PT3M", workout: 1,
        plannedSets: [
            { reps: 15, weight: 200, order: 1},
            { reps: 13, weight: 200, order: 2},
            { reps: 15, weight: 180, order: 3},
        ]
    },
    //Cable Crunch
    { exercise: "Cable Crunch", restTime: "PT3M", workout: 1,
        plannedSets: [
            { reps: 15, weight: 45, order: 1},
            { reps: 12, weight: 45, order: 2},
            { reps: 15, weight: 40, order: 3},
        ]
    },
]

// Resolved by name so the seed doesn't depend on database ids
const exerciseId = async (name: string) =>
    (await prisma.exercise.findFirstOrThrow({ where: { name, userId: null } })).id

const seedExercises = async () => {
    for (const exercise of EXERCISES) {
        // no upsert: the global catalog has userId null, which can't be used in a unique where
        const existing = await prisma.exercise.findFirst({ where: { name: exercise.name, userId: null } })
        if (!existing) await prisma.exercise.create({ data: exercise })
    }
}

const buildWorkoutCode = (title: string, id: number) => {
    const slug = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    return `${slug || 'workout'}-${id}`
}

// user1's training: two 5-day programs, the first one fully planned for two workouts
const seedTraining = async (userId: number) => {
    const programs = [
        { title: "5*W ~ 3 Upper, 2 Lower ~ Plan 10", description: "Upper Lower 5 times a week",
            workouts: ["Upper 1", "Lower 1", "Upper 2", "Lower 2", "Upper 3"] },
        { title: "5*W ~ 3 Upper, 2 Lower ~ Plan 11", description: "Upper Lower 5 times a week",
            workouts: ["Upper", "Lower", "Upper", "Lower", "Upper"] },
    ]

    const createdPrograms = []
    const workouts = []
    for (const program of programs) {
        const createdProgram = await prisma.workoutProgram.create({
            data: { title: program.title, description: program.description, userId },
        })
        createdPrograms.push(createdProgram)
        for (const title of program.workouts) {
            const workout = await prisma.workout.create({
                data: { title, description: `${title} workout of the ${program.title}`, userId, code: "", workoutProgramId: createdProgram.id },
            })
            workouts.push(await prisma.workout.update({ where: { id: workout.id }, data: { code: buildWorkoutCode(title, workout.id) } }))
        }
    }

    const workoutExercises = []
    for (const [index, workoutExercise] of WORKOUT_EXERCISES.entries()) {
        workoutExercises.push(await prisma.workoutExercise.create({
            data: {
                exerciseId: await exerciseId(workoutExercise.exercise),
                workoutId: workouts[workoutExercise.workout].id,
                restTime: workoutExercise.restTime,
                order: index + 1,
                plannedSets: {
                    // top set aims for a range, back-off sets for a fixed target
                    create: workoutExercise.plannedSets.map((set) => ({
                        order: set.order,
                        repsMin: set.reps,
                        repsMax: set.order === 1 ? set.reps + 2 : set.reps,
                        weight: set.weight,
                    })),
                },
            },
            include: { plannedSets: true },
        }))
    }

    const notes = [
        { note: "control ++", workoutExercise: workoutExercises[3] },
        { note: "stop the low foot shit just go regular (no rest between sets) ", workoutExercise: workoutExercises[8] },
        { title: "TODO", note: "keep this program for at least a good 5 months", workoutProgram: createdPrograms[1] },
        { title: "Focus", note: "Focus on lifting heavy weight for 5-10 reps then up the weight", workout: workouts[0] },
    ]
    for (const note of notes) {
        await prisma.notes.create({
            data: {
                title: note.title,
                note: note.note,
                user: { connect: { id: userId } },
                workout: note.workout ? { connect: { id: note.workout.id } } : undefined,
                workoutProgram: note.workoutProgram ? { connect: { id: note.workoutProgram.id } } : undefined,
                workoutExercise: note.workoutExercise ? { connect: { id: note.workoutExercise.id } } : undefined,
            },
        })
    }

    return workouts.slice(0, 2)
}

// 6 weeks of "Upper 1" and "Lower 1" with progressive overload, so the progression graphs have data:
// each week adds a rep within the planned range, then +2.5kg and back to the bottom of the range
const seedSessions = async (userId: number, workoutIds: number[]) => {
    const WEEKS = 6
    for (let week = 0; week < WEEKS; week++) {
        for (const [day, workoutId] of workoutIds.entries()) {
            const workout = await prisma.workout.findUniqueOrThrow({
                where: { id: workoutId },
                include: { workoutExercises: { include: { plannedSets: true }, orderBy: { order: 'asc' } } },
            })
            const startedAt = new Date(Date.now() - ((WEEKS - week) * 7 - day) * 24 * 3600 * 1000)

            await prisma.workoutSession.create({
                data: {
                    title: workout.title,
                    userId,
                    workoutId: workout.id,
                    startedAt,
                    finishedAt: new Date(startedAt.getTime() + 75 * 60 * 1000),
                    note: week === WEEKS - 1 ? "deload next week" : undefined,
                    exercises: {
                        create: workout.workoutExercises.map((workoutExercise) => ({
                            order: workoutExercise.order,
                            exerciseId: workoutExercise.exerciseId,
                            workoutExerciseId: workoutExercise.id,
                            sets: {
                                create: workoutExercise.plannedSets.map((set) => {
                                    const range = set.repsMax - set.repsMin + 1
                                    return {
                                        order: set.order,
                                        reps: set.repsMin + (week % range),
                                        weight: (set.weight ?? 0) + 2.5 * Math.floor(week / range),
                                        note: week === 0 && set.order === 1 ? "first week, finding the weights" : undefined,
                                    }
                                }),
                            },
                        })),
                    },
                },
            })
        }
    }
}

async function main() {
    await seedUsers();
    await seedExercises();

    // workouts are not unique, so only seed the training data once
    const user = await prisma.user.findUniqueOrThrow({ where: { email: 'user1@example.com' } })
    if (await prisma.workout.count({ where: { userId: user.id } })) {
        console.log('Training data already seeded, skipping')
        return
    }
    const workouts = await seedTraining(user.id)
    await seedSessions(user.id, workouts.map((workout) => workout.id))
}

main()
    .finally(async () => {
        await prisma.$disconnect()
    })
