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
    title: "Data & Metrics - Trevor",
    theme: "Numbers that matter in hiring",
    emoji: "🕹️",
    pointsPerQuestion: 10,
    questions: [
      {
        id: 9,
        text: "What is the average time-to-hire for roles at Sourcegraph over the past two fiscal years?",
        options: ["33", "40", "45", "62"],
        correctAnswer: 1,
        explanation: "Across all roles the average was 40 days."
      },
      {
        id: 10,
        text: "How many candidates does a recruiter screen for every 1 hire at Sourcegraph?",
        options: ["6", "8", "14", "21"],
        correctAnswer: 3,
        explanation: "Roughly 21 screens are needed per hire."
      },
      {
        id: 11,
        text: "How many applicants are there for every hire at Sourcegraph?",
        options: ["385", "624", "1,062", "1,450"],
        correctAnswer: 1,
        explanation: "About 624 applicants convert to one hire."
      },
      {
        id: 12,
        text: "How many candidates did we interview last fiscal year?",
        options: ["288", "590", "746", "1,287"],
        correctAnswer: 3,
        explanation: "We interviewed 1,287 candidates last year."
      },
      {
        id: 13,
        text: "Which source produced the most hires over the past two fiscal years?",
        options: [
          "Sourcing via LinkedIn Recruiter",
          "Third-party job boards (LinkedIn, Hacker News, etc.)",
          "Applications directly from our careers page",
          "Referrals"
        ],
        correctAnswer: 0,
        explanation: "LinkedIn Recruiter outreach generated the most hires."
      },
      {
        id: 14,
        text: "What % of our hires came from referrals?",
        options: ["5%", "11%", "23%", "32%"],
        correctAnswer: 2,
        explanation: "Referrals accounted for 23 % of hires."
      },
      {
        id: 15,
        text: "What was our average response rate on LinkedIn Recruiter?",
        options: ["9%", "14%", "17%", "22%"],
        correctAnswer: 3,
        explanation: "Average InMail response rate was 22 %."
      },
      {
        id: 16,
        text: "Which non-recruiting teammate spent the most time interviewing over the past two fiscal years?",
        options: [
          "Quinn Slack",
          "Aimee Menne",
          "Erika Rice Scherpelz",
          "Matt Manela",
          "Jon Kishpaugh",
          "Enrique Gonzales"
        ],
        correctAnswer: 4,
        explanation: "Jon Kishpaugh logged the most interview hours."
      },
      {
        id: 17,
        text: "How many hours did Jon spend interviewing?",
        options: [
          "52 hours (43 candidates)",
          "67 hours (55 candidates)",
          "90 hours (75 candidates)",
          "120 hours (99 candidates)"
        ],
        correctAnswer: 2,
        explanation: "He spent about 90 hours interviewing 75 candidates."
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
        id: 18,
        text: "What's the most common source of hires at Sourcegraph?",
        options: ["Referrals", "Inbound applications", "LinkedIn outreach", "Events"],
        correctAnswer: 0,
        explanation: "Employee referrals are typically the highest quality and most common source of hires."
      },
      {
        id: 19,
        text: "What's the average number of interviews in our process?",
        options: ["3", "4", "5", "6"],
        correctAnswer: 1,
        explanation: "Most roles at Sourcegraph involve 4 interview stages including screening and final rounds."
      },
      {
        id: 20,
        text: "Which role did we hire for most last year?",
        options: ["Software Engineer", "Sales Development Rep", "Customer Engineer", "Product Manager"],
        correctAnswer: 0,
        explanation: "Engineering roles typically make up the largest portion of hires at a tech company like Sourcegraph."
      },
      {
        id: 21,
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
        id: 22,
        text: "How many applications has Sourcegraph received year-to-date? (Closest answer wins!)",
        options: ["2,500", "5,000", "7,500", "10,000+"],
        correctAnswer: 2,
        explanation: "This is estimated - the actual number would depend on current hiring volume and timing."
      }
    ]
  }
];
