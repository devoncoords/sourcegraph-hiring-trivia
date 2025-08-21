import { Round } from '@/types';

export const triviaRounds: Round[] = [
  {
    id: 1,
    title: "Hiring Myths – Fact or Fiction?",
    theme: "Test knowledge of common hiring misconceptions",
    emoji: "🕹️",
    pointsPerQuestion: 10,
    questions: [
      {
        id: 1,
        text: "Candidates decide within the first ___ minutes if they're interested in the role.",
        options: ["5 minutes", "15 minutes", "30 minutes", "60 minutes"],
        correctAnswer: 0,
        explanation: "Studies show candidates form their impression within the first 5 minutes of an interview."
      },
      {
        id: 2,
        text: "True or False: The average recruiter looks at a resume for less than 10 seconds.",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation: "Research indicates recruiters spend about 6-8 seconds on initial resume screening."
      },
      {
        id: 3,
        text: "True or False: AI is currently allowed to make hiring decisions without human review.",
        options: ["True", "False"],
        correctAnswer: 1,
        explanation: "Most jurisdictions require human oversight for AI-driven hiring decisions to prevent bias."
      },
      {
        id: 4,
        text: "What percentage of job seekers lie on their resumes?",
        options: ["15%", "35%", "58%", "75%"],
        correctAnswer: 2,
        explanation: "Studies suggest approximately 58% of hiring managers have caught lies on resumes."
      }
    ]
  },
  {
    id: 2,
    title: "Interview Scenarios",
    theme: "What's the best practice in tricky interview moments",
    emoji: "🕹️",
    pointsPerQuestion: 10,
    questions: [
      {
        id: 5,
        text: "A candidate shows up 10 minutes late without notice. Do you:",
        options: [
          "End the interview immediately",
          "Proceed but make note of it",
          "Ask them to reschedule",
          "Ignore it completely"
        ],
        correctAnswer: 1,
        explanation: "Professional approach is to proceed while noting the punctuality issue for evaluation."
      },
      {
        id: 6,
        text: "Which of these is an illegal interview question?",
        options: [
          "What year did you graduate?",
          "What are your salary expectations?",
          "What motivates you?",
          "Do you have children?"
        ],
        correctAnswer: 3,
        explanation: "Asking about family status, including children, is illegal as it can lead to discrimination."
      },
      {
        id: 7,
        text: "During a technical screen, the candidate solves the problem differently than expected. What's the right next step?",
        options: [
          "Tell them they're wrong",
          "Ask them to explain their approach",
          "Move to the next question",
          "End the interview"
        ],
        correctAnswer: 1,
        explanation: "Understanding their thought process is more valuable than getting the 'expected' answer."
      },
      {
        id: 8,
        text: "What's the best way to handle a candidate who seems nervous?",
        options: [
          "Point out their nervousness",
          "Speed up the interview",
          "Create a welcoming environment",
          "Skip the hard questions"
        ],
        correctAnswer: 2,
        explanation: "A welcoming environment helps candidates perform at their best and gives you better data."
      }
    ]
  },
  {
    id: 3,
    title: "Data & Metrics",
    theme: "Numbers that matter in hiring",
    emoji: "🕹️",
    pointsPerQuestion: 10,
    questions: [
      {
        id: 9,
        text: "What's the average time-to-hire for tech roles in the U.S.?",
        options: ["20 days", "44 days", "60 days", "90 days"],
        correctAnswer: 1,
        explanation: "The average time-to-hire for tech roles is approximately 44 days according to industry data."
      },
      {
        id: 10,
        text: "What % of candidates drop off if the application takes more than 15 minutes?",
        options: ["20%", "30%", "50%", "70%"],
        correctAnswer: 2,
        explanation: "About 50% of candidates abandon applications that take longer than 15 minutes."
      },
      {
        id: 11,
        text: "Roughly how many people does a recruiter screen for every 1 hire?",
        options: ["10", "25", "50", "100+"],
        correctAnswer: 2,
        explanation: "On average, recruiters screen about 50 candidates for every successful hire."
      },
      {
        id: 12,
        text: "What's the average cost per hire in tech?",
        options: ["$2,000", "$5,000", "$15,000", "$25,000"],
        correctAnswer: 2,
        explanation: "The average cost per hire in tech is approximately $15,000 including all recruiting expenses."
      }
    ]
  },
  {
    id: 4,
    title: "Sourcegraph-Specific Round",
    theme: "Inside knowledge about Sourcegraph's hiring process",
    emoji: "🕹️",
    pointsPerQuestion: 20, // Double points!
    questions: [
      {
        id: 13,
        text: "What's the most common source of hires at Sourcegraph?",
        options: ["Referrals", "Inbound applications", "LinkedIn outreach", "Events"],
        correctAnswer: 0,
        explanation: "Employee referrals are typically the highest quality and most common source of hires."
      },
      {
        id: 14,
        text: "What's the average number of interviews in our process?",
        options: ["3", "4", "5", "6"],
        correctAnswer: 1,
        explanation: "Most roles at Sourcegraph involve 4 interview stages including screening and final rounds."
      },
      {
        id: 15,
        text: "Which role did we hire for most last year?",
        options: ["Software Engineer", "Sales Development Rep", "Customer Engineer", "Product Manager"],
        correctAnswer: 0,
        explanation: "Engineering roles typically make up the largest portion of hires at a tech company like Sourcegraph."
      },
      {
        id: 16,
        text: "Which teammate asks the longest interview questions? 😄",
        options: ["Quinn", "Beyang", "Alex", "The hiring manager"],
        correctAnswer: 2,
        explanation: "This is just a fun inside joke question - everyone's interview style is different!"
      }
    ]
  },
  {
    id: 5,
    title: "Final Round: Price is Right!",
    theme: "Closest answer wins",
    emoji: "⚡",
    pointsPerQuestion: 50, // Big points for final round
    questions: [
      {
        id: 17,
        text: "How many applications has Sourcegraph received year-to-date? (Closest answer wins!)",
        options: ["2,500", "5,000", "7,500", "10,000+"],
        correctAnswer: 2,
        explanation: "This is estimated - the actual number would depend on current hiring volume and timing."
      }
    ]
  }
];
