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
        text: "A candidate does not show up for the interview in the first 5 minutes. What is your next course of action?",
        options: [
          "End the interview",
          "Send an angry email",
          "Send a message in the private Slack channel for the position and tag the Recruiter",
          "Ignore it completely"
        ],
        correctAnswer: 2,
        explanation: "Following proper escalation procedures by notifying the recruiter through appropriate channels is the professional approach."
      },
      {
        id: 6,
        text: "Which of these is an illegal interview question?",
        options: [
          "What year did you graduate?",
          "What are your salary expectations?",
          "What motivates you?",
          "Are you married?"
        ],
        correctAnswer: 3,
        explanation: "Asking about marital status is illegal as it can lead to discrimination based on personal relationships."
      },
      {
        id: 7,
        text: "Which one of these is not an overall hiring recommendation?",
        options: [
          "Strong Yes",
          "Yes",
          "Neutral",
          "No",
          "Strong No"
        ],
        correctAnswer: 2,
        explanation: "Standard hiring recommendations are Strong Yes, Yes, No, and Strong No. 'Neutral' is not typically used as it doesn't provide clear direction."
      },
      {
        id: 8,
        text: "A candidate asks you for feedback. What is not a best practice for giving candidate feedback?",
        options: [
          "Send them an email with feedback",
          "Thank the candidate for their time",
          "Start by discussing the positives",
          "Be specific when providing feedback",
          "Tie the feedback back to the job description"
        ],
        correctAnswer: 0,
        explanation: "Feedback should typically be given verbally first, either during a call or in person, rather than solely through email which can seem impersonal."
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
