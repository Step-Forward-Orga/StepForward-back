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
        {name : "Lats Pullover", description: ""},
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

// const seedWorkout = async () => {
//     const workouts = [
//         { title: "Upper 1", description: "Upper 1 workout of the 11th Plan", userId: 1}
//     ]

//     for (const workout of workouts) {
//         await prisma.exercise.upsert({
//             where: { name: workout.name },
//             update: {},
//             create: {
//                 name: workout.name,
//                 description: workout.description,
//             },
//         })
//     }
// }

async function main() {
    seedUsers();
    seedExercises();
}

main()
    .finally(async () => {
        await prisma.$disconnect()
    })