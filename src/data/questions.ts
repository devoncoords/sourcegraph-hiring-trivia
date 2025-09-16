import { Round } from '@/types';

// Updated trivia questions - Database reactivated!
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
        text: "Fact or Fiction: On average, 50% of candidates who start a job application actually finish it.",
        options: ["Fact", "Fiction"],
        correctAnswer: 1,
        explanation: "Fiction: The reality is much lower — only about 30% of candidates finish an application."
      },
      {
        id: 2,
        text: "Fact or Fiction: Recruiters, on average, spend less than 10 seconds reviewing each resume.",
        options: ["Fact", "Fiction"],
        correctAnswer: 0,
        explanation: "Fact: It's about 7 seconds before deciding whether to pass or reject."
      },
      {
        id: 3,
        text: "Fact or Fiction: This fiscal year at Sourcegraph, we've had over 93% of job offers accepted by candidates.",
        options: ["Fact", "Fiction"],
        correctAnswer: 0,
        explanation: "Fact: We've averaged 95% acceptance rate - in comparison to the industry average of 75-85%!"
      },
      {
        id: 4,
        text: "Fact or Fiction: On average, at Sourcegraph, it takes candidates 5 days to accept an offer.",
        options: ["Fact", "Fiction"],
        correctAnswer: 1,
        explanation: "Fiction: It takes candidates on average 3.6 days to accept an offer."
      }
    ]
  },
  {
    id: 2,
    title: "Interviewing at Sourcegraph",
    theme: "Inside knowledge about Sourcegraph's hiring process + best practices",
    emoji: "🕹️",
    pointsPerQuestion: 10,
    questions: [
      {
        id: 5,
        text: "Which of these is an illegal interview question?",
        options: [
          "What year did you graduate?",
          "What is your current compensation?",
          "Where are you from?",
          "What do you like to do in your spare time?",
          "Are you in a relationship?",
          "How old are your children?",
          "What does your partner do for a living?",
          "All of the above"
        ],
        correctAnswer: 7,
        explanation: "All of these questions are illegal as they can lead to discrimination based on age, national origin, marital status, family status, or other protected characteristics."
      },
      {
        id: 6,
        text: "What % of our hires came from referrals?",
        options: [
          "5%",
          "11%",
          "32%",
          "23%"
        ],
        correctAnswer: 3,
        explanation: "23% of our hires came from referrals."
      },
      {
        id: 7,
        text: "This interview is meant to assess if you will be a value-add to the team, take and give constructive criticism, and be an overall supportive team member.",
        options: [
          "Recruiter Screen",
          "Hiring Manager Screen",
          "Resume Deep Dive",
          "Peer Interview",
          "Cross-functional Team Collaboration Interview",
          "Values Interview"
        ],
        correctAnswer: 3,
        explanation: "The Peer Interview is designed to assess team fit, ability to give and receive constructive feedback, and collaborative team dynamics."
      },
      {
        id: 8,
        text: "A candidate asks you for feedback. What is *not* a best practice for giving candidate feedback?",
        options: [
          "Send them an email with feedback",
          "Thank the candidate for their time",
          "Start by discussing the positives",
          "Be specific when providing feedback",
          "Tie the feedback back to the job description"
        ],
        correctAnswer: 0,
        explanation: "Provide feedback verbally, not in writing. Providing verbal feedback gives the candidate one final personal touch-point with you. It also reduces the likelihood of having your exact words used against you. We never provide individualized feedback in writing."
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
        text: "What is the average time-to-hire for roles at Sourcegraph over the past two fiscal years?",
        options: ["33 days", "40 days", "45 days", "62 days"],
        correctAnswer: 1,
        explanation: "Across all roles the average was 40 days."
      },
      {
        id: 10,
        text: "How many candidates does a recruiter screen for every 1 hire at Sourcegraph?",
        options: ["6", "8", "14", "21"],
        correctAnswer: 3,
        explanation: "Roughly 21 candidates are screened for every hire at Sourcegraph."
      },
      {
        id: 11,
        text: "How many applicants are there for every hire at Sourcegraph?",
        options: ["385", "624", "1,062", "1,450"],
        correctAnswer: 1,
        explanation: "Approximately 624 applicants are needed for every hire at Sourcegraph."
      },
      {
        id: 12,
        text: "Which non-recruiting teammate spent the most time interviewing over the past fiscal year?",
        options: [
          "Quinn Slack",
          "Aimee Menne",
          "Erika Rice Scherpelz",
          "Matt Manela",
          "Jon Kishpaugh",
          "Enrique Gonzales"
        ],
        correctAnswer: 1,
        explanation: "Aimee Menne has dedicated the most interview time among non-recruiting teammates over the past fiscal year."
      }
    ]
  },
  {
    id: 4,
    title: "Final Round: Price is Right!",
    theme: "Closest answer wins",
    emoji: "⚡",
    pointsPerQuestion: 20, // Final round points
    questions: [
      {
        id: 22,
        text: "How many applications has Sourcegraph received since January 1, 2025? (Enter your best guess - closest wins!)",
        options: [], // No options for open-ended
        correctAnswer: -1, // Not used for open-ended
        type: 'open-ended',
        correctValue: 26196,
        explanation: "The actual number is 26,196 applications since January 1, 2025. In Price is Right style, the closest guess without going over wins!"
      }
    ]
  }
];
