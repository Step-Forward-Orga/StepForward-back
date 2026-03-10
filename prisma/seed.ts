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

const seedExercises = async () => {
    const exercises = [
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

    for (const exercise of exercises) {
        await prisma.exercise.upsert({
            where: { name: exercise.name },
            update: {},
            create: {
                name: exercise.name,
                description: exercise.description,
            },
        })
    }
}

const seedWorkout = async () => {
    const workouts = [
        { title: "Upper 1", description: "Upper 1 workout of the 11th Plan", userId: 1 },
        { title: "Lower 1", description: "Lower 1 workout of the 11th Plan", userId: 1 },
        { title: "Upper 1", description: "Upper 1 workout of the 11th Plan", userId: 1 },
        { title: "Lower 2", description: "Lower 2 workout of the 11th Plan", userId: 1 },
        { title: "Upper 3", description: "Upper 3 workout of the 11th Plan", userId: 1 },
        { title: "Upper", description: "Upper workout of the 10th Plan", userId: 1 },
        { title: "Lower", description: "Lower workout of the 10th Plan", userId: 1 },
        { title: "Upper", description: "Upper workout of the 10th Plan", userId: 1 },
        { title: "Lower", description: "Lower workout of the 10th Plan", userId: 1 },
        { title: "Upper", description: "Upper workout of the 10th Plan", userId: 1 },
    ]

    for (const workout of workouts) {

        const createdWorkout = await prisma.workout.create({
            data: {
                title: workout.title,
                description: workout.description,
                userId: workout.userId,
                code: "",
            }
        })

        const slug = workout.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

        const code = `${slug || 'workout'}-${createdWorkout.id}`

        await prisma.workout.update({
        where: { id: createdWorkout.id },
        data: { 
            code: code,
            user: {
                connect: { id: workout.userId }
            }}
        })
    }
}

const seedWorkoutProgram = async () => {
    const workoutPrograms = [
        { title: "5*W ~ 3 Upper, 2 Lower ~ Plan 10", description: "Upper Lower 5 times a week", userId: 1, workoutsId: [1, 2, 3, 4, 5] },
        { title: "5*W ~ 3 Upper, 2 Lower ~ Plan 11", description: "Upper Lower 5 times a week", userId: 1, workoutsId: [6, 7, 8, 9, 10] },
    ]

    for (const workoutProgram of workoutPrograms) {
        await prisma.workoutProgram.create({
            data: {
                title: workoutProgram.title,
                description: workoutProgram.description,
                user: { 
                    connect: { id: workoutProgram.userId }
                },
                workouts: {
                    connect: workoutProgram.workoutsId.map((id) => ({ id })),
                }
            },
        })
    }

}

const seedWorkoutExercise = async () => {
    const workoutExercises = [
        //sm incline press
        { exerciseId: 20, restTime: "PTM3M",  completed: false, workoutId: 1, 
            plannedSets: [
                { reps: 8, weight: 80, order: 1, type: "PLANNED"},
                { reps: 6, weight: 80, order: 2, type: "PLANNED"},
                { reps: 10, weight: 65, order: 3, type: "PLANNED"},
            ]
        },
        //lat pull down
        { exerciseId: 14, restTime: "PTM3M",  completed: false, workoutId: 1,
            plannedSets: [
                { reps: 8, weight: 105, order: 1, type: "PLANNED"},
                { reps: 6, weight: 105, order: 2, type: "PLANNED"},
                { reps: 10, weight: 90, order: 3, type: "PLANNED"},
            ]
        },
        //decline db press
        { exerciseId: 21, restTime: "PTM3M",  completed: false, workoutId: 1,
            plannedSets: [
                { reps: 7, weight: 48, order: 1, type: "PLANNED"},
                { reps: 5, weight: 48, order: 2, type: "PLANNED"},
                { reps: 7, weight: 42, order: 3, type: "PLANNED"},
            ]
        },
        //tbar
        { exerciseId: 13, restTime: "PTM3M",  completed: false, workoutId: 1,
            plannedSets: [
                { reps: 7, weight: 90, order: 1, type: "PLANNED"},
                { reps: 6, weight: 90, order: 2, type: "PLANNED"},
                { reps: 10, weight: 75, order: 3, type: "PLANNED"},
            ]
        },
        //Machine pec fly
        { exerciseId: 11, restTime: "PTM3M",  completed: false, workoutId: 1,
            plannedSets: [
                { reps: 8, weight: 40, order: 1, type: "PLANNED"},
                { reps: 5, weight: 40, order: 2, type: "PLANNED"},
                { reps: 6, weight: 30, order: 3, type: "PLANNED"},
            ]
        },
        //Lat pullover
        { exerciseId: 22, restTime: "PTM3M",  completed: false, workoutId: 1,
            plannedSets: [
                { reps: 6, weight: 32.5, order: 1, type: "PLANNED"},
                { reps: 5, weight: 32.5, order: 2, type: "PLANNED"},
                { reps: 10, weight: 25, order: 3, type: "PLANNED"},
            ]
        },
        // ! workout 2
        //Bulgarian Split Squat
        { exerciseId: 52, restTime: "PTM3M",  completed: false, workoutId: 2,
            plannedSets: [
                { reps: 8, weight: 80, order: 1, type: "PLANNED"},
                { reps: 6, weight: 80, order: 2, type: "PLANNED"},
                { reps: 10, weight: 65, order: 3, type: "PLANNED"},
            ]
        },
        //Sited Leg Extension
        { exerciseId: 7, restTime: "PTM3M",  completed: false, workoutId: 2,
            plannedSets: [
                { reps: 12, weight: 100, order: 1, type: "PLANNED"},
                { reps: 12, weight: 100, order: 2, type: "PLANNED"},
                { reps: 10, weight: 85, order: 3, type: "PLANNED"},
            ]
        },
        //Leg Press
        { exerciseId: 24, restTime: "PTM3M",  completed: false, workoutId: 2,
            plannedSets: [
                { reps: 8, weight: 220, order: 1, type: "PLANNED"},
                { reps: 6, weight: 220, order: 2, type: "PLANNED"},
                { reps: 10, weight: 190, order: 3, type: "PLANNED"},
            ]
        },
        //Sited Leg Curl
        { exerciseId: 8, restTime: "PTM3M",  completed: false, workoutId: 2,
            plannedSets: [
                { reps: 10, weight: 75, order: 1, type: "PLANNED"},
                { reps: 8, weight: 75, order: 2, type: "PLANNED"},
                { reps: 10, weight: 60, order: 3, type: "PLANNED"},
            ]
        },
        //Horizontal Press Calf Extensions
        { exerciseId: 25, restTime: "PTM3M",  completed: false, workoutId: 2,
            plannedSets: [
                { reps: 15, weight: 200, order: 1, type: "PLANNED"},
                { reps: 13, weight: 200, order: 2, type: "PLANNED"},
                { reps: 15, weight: 180, order: 3, type: "PLANNED"},
            ]
        },
        //Cable Crunch
        { exerciseId: 40, restTime: "PTM3M",  completed: false, workoutId: 2,
            plannedSets: [
                { reps: 15, weight: 45, order: 1, type: "PLANNED"},
                { reps: 12, weight: 45, order: 2, type: "PLANNED"},
                { reps: 15, weight: 40, order: 3, type: "PLANNED"},
            ]
        },
    ]

    for (const workoutExercise of workoutExercises) {
    await prisma.workoutExercise.create({
        data: {
            exercise: {
                connect: { id: workoutExercise.exerciseId }
            },
            restTime: workoutExercise.restTime,
            completed: workoutExercise.completed,
            workout: {
                connect: { id: workoutExercise.workoutId }
            },
            plannedSets: {
                create: workoutExercise.plannedSets.map((set) => ({
                    reps: set.reps,
                    weight: set.weight,
                    order: set.order,
                    type: set.type as "PLANNED" | "COMPLETED",
                })),
            },
        },
    })
    }
}

const seedNotes = async () => {
    const notes = [
        { userId: 1, note: "control ++",  workoutExerciseId: 4 },
        { userId: 1, note: "fst set meh ",  workoutExerciseId: 4 },
        { userId: 1, note: "stop the low foot shit just go regular (no rest between sets) ",  workoutExerciseId: 9 },
        { userId: 1, title: "TODO", note: "keep this program for at least a good 5 months",  workoutProgramId: 2 },
        { userId: 1, title: "Focus", note: "Focus on lifting heavy weight for 5-10 reps then up the weight",  workoutId: 1 },
    ]

    for (const note of notes) {
        await prisma.notes.create({
            data: {
                title: note.title,
                note: note.note,
                user: { connect: { id: note.userId } },
                workout: note.workoutId ? { connect: { id: note.workoutId } } : undefined,
                workoutProgram: note.workoutProgramId ? { connect: { id: note.workoutProgramId } } : undefined,
                workoutExercise: note.workoutExerciseId ? { connect: { id: note.workoutExerciseId } } : undefined,
            },
        })
    }
}

async function main() {
    await seedUsers();
    await seedExercises();
    await seedWorkout();
    await seedWorkoutProgram();
    await seedWorkoutExercise();
    await seedNotes();
}

main()
    .finally(async () => {
        await prisma.$disconnect()
    })