export const courseInfo = {
  title: "AI Automation and Vibe Coding",
  subtitle: "Applied AI Productivity, Agents & Automation for Healthcare",
  catalogSummary: "A practical introductory course on AI automation, workflow design, AI agents, and vibe coding, with healthcare-focused tool demonstrations using Lovable, Replit, Claude Code, n8n, Make, and Zapier.",
  sector: "Healthcare",
  audience: "Anyone",
  duration: "2 Hours",
  level: "Beginner to Intermediate",
  deliveryMode: "Self-paced",
  courseType: "Applied AI / Productivity / Automation",
  passingScore: 70,
  description: "This course introduces learners to the fundamentals of AI automation, workflow design, AI agents, and vibe coding, with practical examples tailored to the healthcare sector. It is designed to help learners understand how artificial intelligence can be used to automate repetitive tasks, improve operational workflows, support decision-making, and enable rapid creation of digital solutions through natural language prompts.",
  fullDescription: "The course begins with the foundations of automation and workflow thinking, then moves into AI agents and vibe coding as new ways of building and improving solutions. It also explores how to design AI automation solutions and identify common automation use cases across work environments. In addition to the conceptual modules, learners will be introduced to practical tools such as Lovable, Replit, Claude Code, n8n, Make, and Zapier, using healthcare-specific demonstrations.",
  objective: "To equip learners with the knowledge and practical understanding needed to identify, design, and apply AI automation and vibe coding approaches to real-world workflows, with examples relevant to healthcare.",
  whyMatters: "Healthcare environments often involve repetitive administrative work, manual follow-ups, documentation burden, fragmented communication, and time-sensitive coordination. AI automation and vibe coding can help address these challenges by enabling faster workflows, smarter decision support, and rapid prototyping of practical solutions.",
  prerequisites: "No prior coding experience is required. Basic digital literacy and general familiarity with AI tools are helpful but not mandatory.",
  targetAudience: "Healthcare professionals, operational staff, administrators, coordinators, analysts, innovation teams, non-technical learners, and anyone interested in AI-powered productivity and automation."
};

export const learningOutcomes = [
  "Explain the concept of automation and distinguish between traditional automation and AI automation",
  "Describe the structure of workflows using triggers, actions, conditions, and outputs",
  "Explain what AI agents are and how they support intelligent workflow execution",
  "Understand the concept of vibe coding and how prompt-driven development works",
  "Identify suitable opportunities for AI automation in work processes",
  "Describe common automation use cases across productivity, communication, decision support, and monitoring",
  "Understand how practical tools such as Lovable, Replit, Claude Code, n8n, Make, and Zapier can be used in healthcare-related scenarios",
  "Recognize how AI automation and vibe coding can improve productivity and workflow efficiency in healthcare contexts"
];

export const skills = [
  "AI Automation Fundamentals",
  "Workflow Design",
  "AI Agents Awareness",
  "Prompt Engineering for App Creation",
  "Vibe Coding Fundamentals",
  "Automation Use Case Identification",
  "Healthcare Productivity Automation",
  "AI-Assisted Solution Design",
  "Workflow Automation Tools Awareness"
];

export const sections = [
  {
    id: "section-1",
    number: 1,
    title: "Introduction to AI Automation",
    shortDescription: "This section introduces the concept of automation and explains how it has evolved from traditional rule-based systems to AI-powered automation. Learners will understand the difference between task automation, process automation, and intelligent automation, and why these approaches matter in modern work environments.",
    tags: ["#AutomationBasics", "#TraditionalAutomation", "#AIAutomation", "#TaskAutomation", "#ProcessAutomation", "#IntelligentAutomation"],
    pdfUrl: "/module1.pdf",
    pdfUrlAr: "/module1_ar.pdf",
    imageUrl: "/images/module1-intro-ai-automation.png",
    totalSlides: 9,
    introVideoUrl: "https://www.youtube.com/embed/NMTqEMZxrNI",
    conclusionVideoUrl: "https://www.youtube.com/embed/ct0SsiLSgfo",
    animations: [
      { id: "s1-anim-trad", animationId: "traditional-automation", afterSlide: 3 },
      { id: "s1-anim-ai", animationId: "ai-automation", afterSlide: 5 },
      { id: "s1-anim-compare", animationId: "trad-vs-ai", afterSlide: 8 },
    ],
    outcomes: [
      "Define what automation means",
      "Distinguish between traditional and AI automation",
      "Identify the three core types of automation"
    ],
    activities: [
      {
        id: "s1-match",
        type: "match",
        title: "Traditional vs AI Automation",
        description: "Match each concept to the correct automation type",
        pairs: [
          { left: "Fixed rules: If X, do Y", right: "Traditional Automation" },
          { left: "Context-aware processing", right: "AI Automation" },
          { left: "Handles only structured data", right: "Traditional Automation" },
          { left: "Processes unstructured text & images", right: "AI Automation" },
          { left: "Adaptive decision logic", right: "AI Automation" },
          { left: "Rigid predefined workflows", right: "Traditional Automation" }
        ]
      },
      {
        id: "s1-flash",
        type: "flashcard",
        title: "Automation Types Flashcards",
        description: "Review the three types of automation",
        cards: [
          { front: "Task Automation", back: "Automates a single, isolated action. Examples: Send confirmation email, create calendar entry, save to spreadsheet." },
          { front: "Process Automation", back: "Connects multiple steps into a unified workflow. Examples: HR onboarding flow, order processing pipeline." },
          { front: "Intelligent Automation", back: "Combines automation with AI capabilities like predicting, classifying, and recommending. Examples: Classify & route tickets, summarize text, detect anomalies." },
          { front: "Traditional Automation", back: "Uses fixed, rule-based logic (If X, do Y). Works well for structured, predictable tasks but cannot handle exceptions or unstructured data." },
          { front: "AI Automation", back: "Context-aware automation that can handle unstructured data, adapt to new situations, and make intelligent decisions." }
        ]
      }
    ],
    moduleQuiz: [
      { question: "What is the main purpose of automation?", options: ["To replace all human workers", "To use technology to perform tasks with minimal human intervention", "To eliminate technology from workflows", "To slow down processes for better quality"], correct: 1 },
      { question: "Which type of automation focuses on a single isolated action?", options: ["Process Automation", "Intelligent Automation", "Task Automation", "Manual Automation"], correct: 2 },
      { question: "What distinguishes AI automation from traditional automation?", options: ["AI automation is slower", "AI automation uses context-aware, adaptive logic", "AI automation only follows fixed rules", "AI automation requires no technology"], correct: 1 },
      { question: "Which is an example of Process Automation?", options: ["Sending a confirmation email", "An HR onboarding workflow connecting multiple steps", "Classifying support tickets using AI", "Saving data to a spreadsheet"], correct: 1 },
      { question: "Intelligent Automation combines automation with:", options: ["Manual labor only", "Fixed rule-based logic only", "AI capabilities like understanding, predicting, and classifying", "Hardware upgrades"], correct: 2 }
    ],
    moduleQuizAr: [
      { question: "\u0645\u0627 \u0647\u0648 \u0627\u0644\u0647\u062f\u0641 \u0627\u0644\u0631\u0626\u064a\u0633\u064a \u0644\u0644\u0623\u062a\u0645\u062a\u0629\u061f", options: ["\u0627\u0633\u062a\u0628\u062f\u0627\u0644 \u062c\u0645\u064a\u0639 \u0627\u0644\u0639\u0627\u0645\u0644\u064a\u0646 \u0627\u0644\u0628\u0634\u0631\u064a\u064a\u0646", "\u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0627\u0644\u062a\u0643\u0646\u0648\u0644\u0648\u062c\u064a\u0627 \u0644\u0623\u062f\u0627\u0621 \u0627\u0644\u0645\u0647\u0627\u0645 \u0628\u0623\u0642\u0644 \u062a\u062f\u062e\u0644 \u0628\u0634\u0631\u064a", "\u0625\u0644\u063a\u0627\u0621 \u0627\u0644\u062a\u0643\u0646\u0648\u0644\u0648\u062c\u064a\u0627 \u0645\u0646 \u0633\u064a\u0631 \u0627\u0644\u0639\u0645\u0644", "\u0625\u0628\u0637\u0627\u0621 \u0627\u0644\u0639\u0645\u0644\u064a\u0627\u062a \u0644\u062c\u0648\u062f\u0629 \u0623\u0641\u0636\u0644"], correct: 1 },
      { question: "\u0623\u064a \u0646\u0648\u0639 \u0645\u0646 \u0627\u0644\u0623\u062a\u0645\u062a\u0629 \u064a\u0631\u0643\u0632 \u0639\u0644\u0649 \u0625\u062c\u0631\u0627\u0621 \u0648\u0627\u062d\u062f \u0645\u0639\u0632\u0648\u0644\u061f", options: ["\u0623\u062a\u0645\u062a\u0629 \u0627\u0644\u0639\u0645\u0644\u064a\u0627\u062a", "\u0627\u0644\u0623\u062a\u0645\u062a\u0629 \u0627\u0644\u0630\u0643\u064a\u0629", "\u0623\u062a\u0645\u062a\u0629 \u0627\u0644\u0645\u0647\u0627\u0645", "\u0627\u0644\u0623\u062a\u0645\u062a\u0629 \u0627\u0644\u064a\u062f\u0648\u064a\u0629"], correct: 2 },
      { question: "\u0645\u0627 \u0627\u0644\u0630\u064a \u064a\u0645\u064a\u0632 \u0623\u062a\u0645\u062a\u0629 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a \u0639\u0646 \u0627\u0644\u0623\u062a\u0645\u062a\u0629 \u0627\u0644\u062a\u0642\u0644\u064a\u062f\u064a\u0629\u061f", options: ["\u0623\u062a\u0645\u062a\u0629 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a \u0623\u0628\u0637\u0623", "\u0623\u062a\u0645\u062a\u0629 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a \u062a\u0633\u062a\u062e\u062f\u0645 \u0645\u0646\u0637\u0642\u0627\u064b \u062a\u0643\u064a\u0641\u064a\u0627\u064b \u0648\u0627\u0639\u064a\u0627\u064b \u0644\u0644\u0633\u064a\u0627\u0642", "\u0623\u062a\u0645\u062a\u0629 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a \u062a\u062a\u0628\u0639 \u0642\u0648\u0627\u0639\u062f \u062b\u0627\u0628\u062a\u0629 \u0641\u0642\u0637", "\u0623\u062a\u0645\u062a\u0629 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a \u0644\u0627 \u062a\u062d\u062a\u0627\u062c \u062a\u0643\u0646\u0648\u0644\u0648\u062c\u064a\u0627"], correct: 1 },
      { question: "\u0623\u064a \u0645\u0645\u0627 \u064a\u0644\u064a \u0645\u062b\u0627\u0644 \u0639\u0644\u0649 \u0623\u062a\u0645\u062a\u0629 \u0627\u0644\u0639\u0645\u0644\u064a\u0627\u062a\u061f", options: ["\u0625\u0631\u0633\u0627\u0644 \u0628\u0631\u064a\u062f \u062a\u0623\u0643\u064a\u062f", "\u0633\u064a\u0631 \u0639\u0645\u0644 \u062a\u0647\u064a\u0626\u0629 \u0627\u0644\u0645\u0648\u0627\u0631\u062f \u0627\u0644\u0628\u0634\u0631\u064a\u0629 \u064a\u0631\u0628\u0637 \u062e\u0637\u0648\u0627\u062a \u0645\u062a\u0639\u062f\u062f\u0629", "\u062a\u0635\u0646\u064a\u0641 \u062a\u0630\u0627\u0643\u0631 \u0627\u0644\u062f\u0639\u0645 \u0628\u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a", "\u062d\u0641\u0638 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a \u0641\u064a \u062c\u062f\u0648\u0644 \u0628\u064a\u0627\u0646\u0627\u062a"], correct: 1 },
      { question: "\u0627\u0644\u0623\u062a\u0645\u062a\u0629 \u0627\u0644\u0630\u0643\u064a\u0629 \u062a\u062c\u0645\u0639 \u0628\u064a\u0646 \u0627\u0644\u0623\u062a\u0645\u062a\u0629 \u0648:", options: ["\u0627\u0644\u0639\u0645\u0644 \u0627\u0644\u064a\u062f\u0648\u064a \u0641\u0642\u0637", "\u0627\u0644\u0645\u0646\u0637\u0642 \u0627\u0644\u062b\u0627\u0628\u062a \u0627\u0644\u0642\u0627\u0626\u0645 \u0639\u0644\u0649 \u0627\u0644\u0642\u0648\u0627\u0639\u062f \u0641\u0642\u0637", "\u0642\u062f\u0631\u0627\u062a \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a \u0645\u062b\u0644 \u0627\u0644\u0641\u0647\u0645 \u0648\u0627\u0644\u062a\u0646\u0628\u0624 \u0648\u0627\u0644\u062a\u0635\u0646\u064a\u0641", "\u062a\u0631\u0642\u064a\u0627\u062a \u0627\u0644\u0623\u062c\u0647\u0632\u0629"], correct: 2 }
    ]
  },
  {
    id: "section-2",
    number: 2,
    title: "Workflow Thinking",
    shortDescription: "This section explains how work is organized into workflows and why workflow thinking is essential for automation design. Learners will explore workflow building blocks such as triggers, actions, conditions, and outputs, and learn how to break a process into structured steps.",
    tags: ["#WorkflowThinking", "#TriggersAndActions", "#Conditions", "#ProcessMapping", "#WorkflowDesign", "#AutomationFlow"],
    pdfUrl: "/module2.pdf",
    pdfUrlAr: "/module2_ar.pdf",
    imageUrl: "/images/module2-workflow-thinking.png",
    totalSlides: 9,
    introVideoUrl: "https://www.youtube.com/embed/DlQRa1ibt20",
    conclusionVideoUrl: "https://www.youtube.com/embed/D2thFBOajKU",
    animations: [
      { id: "s2-anim-workflow", animationId: "workflow-building-blocks", afterSlide: 4 },
    ],
    outcomes: [
      "Understand workflow structure and components",
      "Identify triggers, actions, conditions, and outputs",
      "Map a process into a structured workflow"
    ],
    activities: [
      {
        id: "s2-drag",
        type: "dragdrop",
        title: "Build a Workflow Sequence",
        description: "Drag and drop the workflow components into the correct order",
        items: [
          { id: "trigger", text: "Trigger: Patient submits appointment request", order: 1 },
          { id: "condition", text: "Condition: Check if preferred slot is available", order: 2 },
          { id: "action1", text: "Action: Send confirmation or alternative options", order: 3 },
          { id: "action2", text: "Action: Update calendar and patient record", order: 4 },
          { id: "output", text: "Output: Confirmation notification to patient", order: 5 }
        ]
      },
      {
        id: "s2-match",
        type: "match",
        title: "Workflow Building Blocks",
        description: "Match each workflow component with its definition",
        pairs: [
          { left: "Starts the workflow automatically", right: "Trigger" },
          { left: "The task performed by the system", right: "Action" },
          { left: "Checks if criteria are met before proceeding", right: "Condition" },
          { left: "The final result delivered to the user", right: "Output" },
          { left: "New form submission received", right: "Trigger" },
          { left: "Send email notification", right: "Action" }
        ]
      }
    ],
    moduleQuiz: [
      { question: "What is the first element in a typical workflow?", options: ["Action", "Output", "Trigger", "Condition"], correct: 2 },
      { question: "What does a 'Condition' do in a workflow?", options: ["Starts the workflow", "Checks criteria before proceeding", "Delivers the final result", "Performs the main task"], correct: 1 },
      { question: "Which component represents the task performed by the system?", options: ["Trigger", "Condition", "Action", "Output"], correct: 2 },
      { question: "In a patient appointment workflow, what would be the trigger?", options: ["Doctor reviews the chart", "Patient submits appointment request", "System sends confirmation", "Appointment is added to calendar"], correct: 1 },
      { question: "Why is workflow thinking important for automation?", options: ["It makes tasks slower", "It helps break processes into structured, automatable steps", "It eliminates the need for technology", "It only works for simple tasks"], correct: 1 }
    ],
    moduleQuizAr: [
      { question: "\u0645\u0627 \u0647\u0648 \u0627\u0644\u0639\u0646\u0635\u0631 \u0627\u0644\u0623\u0648\u0644 \u0641\u064a \u0633\u064a\u0631 \u0627\u0644\u0639\u0645\u0644 \u0627\u0644\u0646\u0645\u0648\u0630\u062c\u064a\u061f", options: ["\u0627\u0644\u0625\u062c\u0631\u0627\u0621", "\u0627\u0644\u0645\u062e\u0631\u062c", "\u0627\u0644\u0645\u062d\u0641\u0632", "\u0627\u0644\u0634\u0631\u0637"], correct: 2 },
      { question: "\u0645\u0627\u0630\u0627 \u064a\u0641\u0639\u0644 '\u0627\u0644\u0634\u0631\u0637' \u0641\u064a \u0633\u064a\u0631 \u0627\u0644\u0639\u0645\u0644\u061f", options: ["\u064a\u0628\u062f\u0623 \u0633\u064a\u0631 \u0627\u0644\u0639\u0645\u0644", "\u064a\u062a\u062d\u0642\u0642 \u0645\u0646 \u0627\u0644\u0645\u0639\u0627\u064a\u064a\u0631 \u0642\u0628\u0644 \u0627\u0644\u0645\u062a\u0627\u0628\u0639\u0629", "\u064a\u0642\u062f\u0645 \u0627\u0644\u0646\u062a\u064a\u062c\u0629 \u0627\u0644\u0646\u0647\u0627\u0626\u064a\u0629", "\u064a\u0646\u0641\u0630 \u0627\u0644\u0645\u0647\u0645\u0629 \u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629"], correct: 1 },
      { question: "\u0623\u064a \u0645\u0643\u0648\u0646 \u064a\u0645\u062b\u0644 \u0627\u0644\u0645\u0647\u0645\u0629 \u0627\u0644\u062a\u064a \u064a\u0646\u0641\u0630\u0647\u0627 \u0627\u0644\u0646\u0638\u0627\u0645\u061f", options: ["\u0627\u0644\u0645\u062d\u0641\u0632", "\u0627\u0644\u0634\u0631\u0637", "\u0627\u0644\u0625\u062c\u0631\u0627\u0621", "\u0627\u0644\u0645\u062e\u0631\u062c"], correct: 2 },
      { question: "\u0641\u064a \u0633\u064a\u0631 \u0639\u0645\u0644 \u0645\u0648\u0627\u0639\u064a\u062f \u0627\u0644\u0645\u0631\u0636\u0649\u060c \u0645\u0627 \u0647\u0648 \u0627\u0644\u0645\u062d\u0641\u0632\u061f", options: ["\u064a\u0631\u0627\u062c\u0639 \u0627\u0644\u0637\u0628\u064a\u0628 \u0627\u0644\u0645\u0644\u0641", "\u064a\u0642\u062f\u0645 \u0627\u0644\u0645\u0631\u064a\u0636 \u0637\u0644\u0628 \u0645\u0648\u0639\u062f", "\u064a\u0631\u0633\u0644 \u0627\u0644\u0646\u0638\u0627\u0645 \u062a\u0623\u0643\u064a\u062f\u0627\u064b", "\u064a\u062a\u0645 \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0645\u0648\u0639\u062f \u0644\u0644\u062a\u0642\u0648\u064a\u0645"], correct: 1 },
      { question: "\u0644\u0645\u0627\u0630\u0627 \u064a\u0639\u062f \u0627\u0644\u062a\u0641\u0643\u064a\u0631 \u0628\u0645\u0646\u0647\u062c\u064a\u0629 \u0633\u064a\u0631 \u0627\u0644\u0639\u0645\u0644 \u0645\u0647\u0645\u0627\u064b \u0644\u0644\u0623\u062a\u0645\u062a\u0629\u061f", options: ["\u064a\u062c\u0639\u0644 \u0627\u0644\u0645\u0647\u0627\u0645 \u0623\u0628\u0637\u0623", "\u064a\u0633\u0627\u0639\u062f \u0641\u064a \u062a\u0642\u0633\u064a\u0645 \u0627\u0644\u0639\u0645\u0644\u064a\u0627\u062a \u0625\u0644\u0649 \u062e\u0637\u0648\u0627\u062a \u0645\u0646\u0638\u0645\u0629 \u0642\u0627\u0628\u0644\u0629 \u0644\u0644\u0623\u062a\u0645\u062a\u0629", "\u064a\u0644\u063a\u064a \u0627\u0644\u062d\u0627\u062c\u0629 \u0644\u0644\u062a\u0643\u0646\u0648\u0644\u0648\u062c\u064a\u0627", "\u064a\u0639\u0645\u0644 \u0641\u0642\u0637 \u0644\u0644\u0645\u0647\u0627\u0645 \u0627\u0644\u0628\u0633\u064a\u0637\u0629"], correct: 1 }
    ]
  },
  {
    id: "section-3",
    number: 3,
    title: "AI Agents",
    shortDescription: "This section introduces AI agents as systems that can understand goals, interpret information, make decisions, and take actions within workflows. Learners will understand how AI agents differ from standard automation and where they add value in real processes.",
    tags: ["#AIAgents", "#AgentCapabilities", "#DecisionSupport", "#GoalOrientedSystems", "#IntelligentWorkflows", "#AgentBasedAutomation"],
    pdfUrl: "/module3.pdf",
    pdfUrlAr: "/module3_ar.pdf",
    imageUrl: "/images/module3-ai-agents.png",
    totalSlides: 12,
    introVideoUrl: "https://www.youtube.com/embed/gzjvTUctEDE",
    conclusionVideoUrl: "https://www.youtube.com/embed/Tlo1Q-CzXFk",
    animations: [
      { id: "s3-anim-agent", animationId: "ai-agent-loop", afterSlide: 4 },
    ],
    outcomes: [
      "Define what AI agents are",
      "Explain how AI agents differ from standard automation",
      "Identify where AI agents add value in workflows"
    ],
    activities: [
      {
        id: "s3-flash",
        type: "flashcard",
        title: "AI Agent Concepts",
        description: "Review key AI agent concepts and capabilities",
        cards: [
          { front: "AI Agent", back: "A system that can understand goals, interpret context, make decisions, and take autonomous actions within a workflow." },
          { front: "Goal-Oriented Behavior", back: "AI agents work toward defined objectives rather than just following fixed rules. They can adapt their approach based on context." },
          { front: "Agent vs Standard Automation", back: "Standard automation follows fixed steps. AI agents can interpret, decide, and adapt — handling ambiguity and exceptions." },
          { front: "Decision Support", back: "AI agents can analyze data, identify patterns, and recommend actions to support human decision-making." },
          { front: "Multi-Step Reasoning", back: "AI agents can break complex tasks into sub-tasks, execute them sequentially, and adjust based on intermediate results." }
        ]
      },
      {
        id: "s3-match",
        type: "match",
        title: "Agent Capabilities Matching",
        description: "Match each capability with the correct description",
        pairs: [
          { left: "Reads and understands patient messages", right: "Natural Language Understanding" },
          { left: "Prioritizes tasks based on urgency", right: "Decision Making" },
          { left: "Works toward a defined objective", right: "Goal-Oriented Behavior" },
          { left: "Adjusts workflow based on new data", right: "Adaptive Execution" },
          { left: "Calls APIs and updates records", right: "Tool Use" },
          { left: "Remembers previous interactions", right: "Context Awareness" }
        ]
      }
    ],
    moduleQuiz: [
      { question: "What is an AI agent?", options: ["A simple rule-based script", "A system that can understand goals, interpret context, and take autonomous actions", "A database management tool", "A type of spreadsheet"], correct: 1 },
      { question: "How do AI agents differ from standard automation?", options: ["They are identical", "AI agents can interpret, decide, and adapt to new situations", "Standard automation is more intelligent", "AI agents cannot handle data"], correct: 1 },
      { question: "Which capability allows AI agents to understand patient messages?", options: ["Data Storage", "Natural Language Understanding", "File Management", "Network Security"], correct: 1 },
      { question: "What is 'goal-oriented behavior' in AI agents?", options: ["Following fixed rules without exception", "Working toward defined objectives and adapting approach based on context", "Only processing structured data", "Running on a schedule"], correct: 1 },
      { question: "What is multi-step reasoning in AI agents?", options: ["Running one step repeatedly", "Breaking complex tasks into sub-tasks and adjusting based on results", "Only answering yes/no questions", "Storing data in multiple locations"], correct: 1 }
    ],
    moduleQuizAr: [
      { question: "\u0645\u0627 \u0647\u0648 \u0648\u0643\u064a\u0644 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a\u061f", options: ["\u0628\u0631\u0646\u0627\u0645\u062c \u0628\u0633\u064a\u0637 \u0642\u0627\u0626\u0645 \u0639\u0644\u0649 \u0627\u0644\u0642\u0648\u0627\u0639\u062f", "\u0646\u0638\u0627\u0645 \u064a\u0645\u0643\u0646\u0647 \u0641\u0647\u0645 \u0627\u0644\u0623\u0647\u062f\u0627\u0641 \u0648\u062a\u0641\u0633\u064a\u0631 \u0627\u0644\u0633\u064a\u0627\u0642 \u0648\u0627\u062a\u062e\u0627\u0630 \u0625\u062c\u0631\u0627\u0621\u0627\u062a \u0645\u0633\u062a\u0642\u0644\u0629", "\u0623\u062f\u0627\u0629 \u0625\u062f\u0627\u0631\u0629 \u0642\u0648\u0627\u0639\u062f \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a", "\u0646\u0648\u0639 \u0645\u0646 \u062c\u062f\u0627\u0648\u0644 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a"], correct: 1 },
      { question: "\u0643\u064a\u0641 \u064a\u062e\u062a\u0644\u0641 \u0648\u0643\u0644\u0627\u0621 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a \u0639\u0646 \u0627\u0644\u0623\u062a\u0645\u062a\u0629 \u0627\u0644\u0639\u0627\u062f\u064a\u0629\u061f", options: ["\u0647\u0645 \u0645\u062a\u0637\u0627\u0628\u0642\u0648\u0646", "\u064a\u0645\u0643\u0646 \u0644\u0648\u0643\u0644\u0627\u0621 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a \u0627\u0644\u062a\u0641\u0633\u064a\u0631 \u0648\u0627\u062a\u062e\u0627\u0630 \u0627\u0644\u0642\u0631\u0627\u0631\u0627\u062a \u0648\u0627\u0644\u062a\u0643\u064a\u0641", "\u0627\u0644\u0623\u062a\u0645\u062a\u0629 \u0627\u0644\u0639\u0627\u062f\u064a\u0629 \u0623\u0643\u062b\u0631 \u0630\u0643\u0627\u0621\u064b", "\u0648\u0643\u0644\u0627\u0621 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a \u0644\u0627 \u064a\u0645\u0643\u0646\u0647\u0645 \u0645\u0639\u0627\u0644\u062c\u0629 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a"], correct: 1 },
      { question: "\u0623\u064a \u0642\u062f\u0631\u0629 \u062a\u0633\u0645\u062d \u0644\u0648\u0643\u0644\u0627\u0621 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a \u0628\u0641\u0647\u0645 \u0631\u0633\u0627\u0626\u0644 \u0627\u0644\u0645\u0631\u0636\u0649\u061f", options: ["\u062a\u062e\u0632\u064a\u0646 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a", "\u0641\u0647\u0645 \u0627\u0644\u0644\u063a\u0629 \u0627\u0644\u0637\u0628\u064a\u0639\u064a\u0629", "\u0625\u062f\u0627\u0631\u0629 \u0627\u0644\u0645\u0644\u0641\u0627\u062a", "\u0623\u0645\u0646 \u0627\u0644\u0634\u0628\u0643\u0627\u062a"], correct: 1 },
      { question: "\u0645\u0627 \u0647\u0648 '\u0627\u0644\u0633\u0644\u0648\u0643 \u0627\u0644\u0645\u0648\u062c\u0647 \u0628\u0627\u0644\u0623\u0647\u062f\u0627\u0641' \u0641\u064a \u0648\u0643\u0644\u0627\u0621 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a\u061f", options: ["\u0627\u062a\u0628\u0627\u0639 \u0642\u0648\u0627\u0639\u062f \u062b\u0627\u0628\u062a\u0629 \u0628\u062f\u0648\u0646 \u0627\u0633\u062a\u062b\u0646\u0627\u0621", "\u0627\u0644\u0639\u0645\u0644 \u0646\u062d\u0648 \u0623\u0647\u062f\u0627\u0641 \u0645\u062d\u062f\u062f\u0629 \u0648\u0627\u0644\u062a\u0643\u064a\u0641 \u062d\u0633\u0628 \u0627\u0644\u0633\u064a\u0627\u0642", "\u0645\u0639\u0627\u0644\u062c\u0629 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u0645\u0647\u064a\u0643\u0644\u0629 \u0641\u0642\u0637", "\u0627\u0644\u062a\u0634\u063a\u064a\u0644 \u0648\u0641\u0642 \u062c\u062f\u0648\u0644 \u0632\u0645\u0646\u064a"], correct: 1 },
      { question: "\u0645\u0627 \u0647\u0648 \u0627\u0644\u062a\u0641\u0643\u064a\u0631 \u0645\u062a\u0639\u062f\u062f \u0627\u0644\u062e\u0637\u0648\u0627\u062a \u0641\u064a \u0648\u0643\u0644\u0627\u0621 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a\u061f", options: ["\u062a\u0634\u063a\u064a\u0644 \u062e\u0637\u0648\u0629 \u0648\u0627\u062d\u062f\u0629 \u0628\u0634\u0643\u0644 \u0645\u062a\u0643\u0631\u0631", "\u062a\u0642\u0633\u064a\u0645 \u0627\u0644\u0645\u0647\u0627\u0645 \u0627\u0644\u0645\u0639\u0642\u062f\u0629 \u0625\u0644\u0649 \u0645\u0647\u0627\u0645 \u0641\u0631\u0639\u064a\u0629 \u0648\u0627\u0644\u062a\u0639\u062f\u064a\u0644 \u0628\u0646\u0627\u0621\u064b \u0639\u0644\u0649 \u0627\u0644\u0646\u062a\u0627\u0626\u062c", "\u0627\u0644\u0625\u062c\u0627\u0628\u0629 \u0641\u0642\u0637 \u0628\u0646\u0639\u0645/\u0644\u0627", "\u062a\u062e\u0632\u064a\u0646 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a \u0641\u064a \u0645\u0648\u0627\u0642\u0639 \u0645\u062a\u0639\u062f\u062f\u0629"], correct: 1 }
    ]
  },
  {
    id: "section-4",
    number: 4,
    title: "Vibe Coding",
    shortDescription: "This section introduces vibe coding as a new way of creating digital solutions using natural language prompts instead of traditional programming. Learners will explore how prompt-driven app creation works, why iteration matters, and how vibe coding makes prototyping faster and more accessible.",
    tags: ["#VibeCoding", "#PromptDrivenDevelopment", "#RapidPrototyping", "#DescribeGenerateRefine", "#AIAssistedCreation", "#NoCodeLowCodeThinking"],
    pdfUrl: "/module4.pdf",
    pdfUrlAr: "/module4_ar.pdf",
    imageUrl: "/images/module4-vibe-coding.png",
    totalSlides: 10,
    introVideoUrl: "https://www.youtube.com/embed/O8OfQm_SotM",
    conclusionVideoUrl: "https://www.youtube.com/embed/KT4i4wvTNOE",
    toolIds: ["lovable", "replit", "claude-code"],
    practiceGuides: [
      { toolId: "lovable", title: "Lovable Practice Guide", titleAr: "دليل تدريب Lovable", description: "Hands-on guide with prompts to build a Diabetic Patient Tracking App", descriptionAr: "دليل عملي مع أوامر لبناء تطبيق تتبع مرضى السكري", file: "/guides/lovable-practice-guide.html", fileAr: "/guides/lovable-practice-guide-ar.html" },
      { toolId: "replit", title: "Replit Practice Guide", titleAr: "دليل تدريب Replit", description: "Hands-on guide with prompts to build a Clinical Report Generator", descriptionAr: "دليل عملي مع أوامر لبناء مولّد التقارير السريرية", file: "/guides/replit-practice-guide.html", fileAr: "/guides/replit-practice-guide-ar.html" }
    ],
    animations: [
      { id: "s4-anim-vibe", animationId: "vibe-coding-flow", afterSlide: 3 },
    ],
    outcomes: [
      "Understand what vibe coding is",
      "Explain prompt-driven development workflow",
      "Recognize benefits of rapid prototyping with AI"
    ],
    activities: [
      {
        id: "s4-drag",
        type: "dragdrop",
        title: "Vibe Coding Workflow",
        description: "Arrange the vibe coding steps in the correct order",
        items: [
          { id: "describe", text: "Describe what you want to build in natural language", order: 1 },
          { id: "generate", text: "AI generates the initial code/app", order: 2 },
          { id: "review", text: "Review the generated output", order: 3 },
          { id: "refine", text: "Refine with follow-up prompts", order: 4 },
          { id: "iterate", text: "Iterate until the solution meets requirements", order: 5 }
        ]
      },
      {
        id: "s4-flash",
        type: "flashcard",
        title: "Vibe Coding Key Concepts",
        description: "Review the core concepts of vibe coding",
        cards: [
          { front: "Vibe Coding", back: "Creating digital solutions by describing what you want in natural language, then letting AI generate the code. No traditional programming required." },
          { front: "Describe → Generate → Refine", back: "The core vibe coding loop: describe your idea, AI generates a solution, you refine through iteration until it works as needed." },
          { front: "Prompt-Driven Development", back: "Writing natural language instructions (prompts) to guide AI in building applications, instead of writing code manually." },
          { front: "Rapid Prototyping", back: "Quickly creating working prototypes of ideas using AI tools, enabling fast testing and validation of concepts." },
          { front: "Iteration", back: "The process of repeatedly refining your prompts and the generated output until the solution meets your requirements." }
        ]
      }
    ],
    moduleQuiz: [
      { question: "What is vibe coding?", options: ["A new programming language", "Creating solutions using natural language prompts instead of traditional coding", "A type of database system", "A testing framework"], correct: 1 },
      { question: "What is the core loop of vibe coding?", options: ["Plan, Code, Test", "Describe, Generate, Refine", "Design, Build, Deploy", "Research, Develop, Publish"], correct: 1 },
      { question: "Does vibe coding require extensive programming experience?", options: ["Yes, advanced coding skills are mandatory", "No, it uses natural language prompts", "Only Python knowledge is needed", "Only for experienced developers"], correct: 1 },
      { question: "What is 'rapid prototyping' in the context of vibe coding?", options: ["Writing code very fast manually", "Quickly creating working prototypes using AI tools", "Skipping testing entirely", "Copying existing applications"], correct: 1 },
      { question: "Why is iteration important in vibe coding?", options: ["It is not important", "It refines prompts and output until the solution meets requirements", "It makes the process slower", "It replaces testing"], correct: 1 }
    ],
    moduleQuizAr: [
      { question: "\u0645\u0627 \u0647\u064a \u0627\u0644\u0628\u0631\u0645\u062c\u0629 \u0628\u0627\u0644\u0648\u0635\u0641\u061f", options: ["\u0644\u063a\u0629 \u0628\u0631\u0645\u062c\u0629 \u062c\u062f\u064a\u062f\u0629", "\u0625\u0646\u0634\u0627\u0621 \u062d\u0644\u0648\u0644 \u0628\u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0623\u0648\u0627\u0645\u0631 \u0646\u0635\u064a\u0629 \u0637\u0628\u064a\u0639\u064a\u0629 \u0628\u062f\u0644\u0627\u064b \u0645\u0646 \u0627\u0644\u0628\u0631\u0645\u062c\u0629 \u0627\u0644\u062a\u0642\u0644\u064a\u062f\u064a\u0629", "\u0646\u0648\u0639 \u0645\u0646 \u0623\u0646\u0638\u0645\u0629 \u0642\u0648\u0627\u0639\u062f \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a", "\u0625\u0637\u0627\u0631 \u0639\u0645\u0644 \u0644\u0644\u0627\u062e\u062a\u0628\u0627\u0631"], correct: 1 },
      { question: "\u0645\u0627 \u0647\u064a \u0627\u0644\u062d\u0644\u0642\u0629 \u0627\u0644\u0623\u0633\u0627\u0633\u064a\u0629 \u0644\u0644\u0628\u0631\u0645\u062c\u0629 \u0628\u0627\u0644\u0648\u0635\u0641\u061f", options: ["\u062e\u0637\u0637\u060c \u0628\u0631\u0645\u062c\u060c \u0627\u062e\u062a\u0628\u0631", "\u0635\u0641\u060c \u0648\u0644\u0651\u062f\u060c \u062d\u0633\u0651\u0646", "\u0635\u0645\u0645\u060c \u0627\u0628\u0646\u0650\u060c \u0627\u0646\u0634\u0631", "\u0627\u0628\u062d\u062b\u060c \u0637\u0648\u0651\u0631\u060c \u0627\u0646\u0634\u0631"], correct: 1 },
      { question: "\u0647\u0644 \u062a\u062a\u0637\u0644\u0628 \u0627\u0644\u0628\u0631\u0645\u062c\u0629 \u0628\u0627\u0644\u0648\u0635\u0641 \u062e\u0628\u0631\u0629 \u0628\u0631\u0645\u062c\u064a\u0629 \u0648\u0627\u0633\u0639\u0629\u061f", options: ["\u0646\u0639\u0645\u060c \u0645\u0647\u0627\u0631\u0627\u062a \u0628\u0631\u0645\u062c\u0629 \u0645\u062a\u0642\u062f\u0645\u0629 \u0625\u0644\u0632\u0627\u0645\u064a\u0629", "\u0644\u0627\u060c \u062a\u0633\u062a\u062e\u062f\u0645 \u0623\u0648\u0627\u0645\u0631 \u0646\u0635\u064a\u0629 \u0637\u0628\u064a\u0639\u064a\u0629", "\u0641\u0642\u0637 \u0645\u0639\u0631\u0641\u0629 \u0628\u0627\u064a\u062b\u0648\u0646 \u0645\u0637\u0644\u0648\u0628\u0629", "\u0641\u0642\u0637 \u0644\u0644\u0645\u0637\u0648\u0631\u064a\u0646 \u0627\u0644\u0645\u062d\u062a\u0631\u0641\u064a\u0646"], correct: 1 },
      { question: "\u0645\u0627 \u0647\u0648 '\u0627\u0644\u0646\u0645\u0630\u062c\u0629 \u0627\u0644\u0633\u0631\u064a\u0639\u0629' \u0641\u064a \u0633\u064a\u0627\u0642 \u0627\u0644\u0628\u0631\u0645\u062c\u0629 \u0628\u0627\u0644\u0648\u0635\u0641\u061f", options: ["\u0643\u062a\u0627\u0628\u0629 \u0627\u0644\u0643\u0648\u062f \u0628\u0633\u0631\u0639\u0629 \u064a\u062f\u0648\u064a\u0627\u064b", "\u0625\u0646\u0634\u0627\u0621 \u0646\u0645\u0627\u0630\u062c \u0639\u0645\u0644 \u0633\u0631\u064a\u0639\u0629 \u0628\u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0623\u062f\u0648\u0627\u062a \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a", "\u062a\u062e\u0637\u064a \u0627\u0644\u0627\u062e\u062a\u0628\u0627\u0631 \u062a\u0645\u0627\u0645\u0627\u064b", "\u0646\u0633\u062e \u0627\u0644\u062a\u0637\u0628\u064a\u0642\u0627\u062a \u0627\u0644\u0645\u0648\u062c\u0648\u062f\u0629"], correct: 1 },
      { question: "\u0644\u0645\u0627\u0630\u0627 \u064a\u0639\u062f \u0627\u0644\u062a\u0643\u0631\u0627\u0631 \u0645\u0647\u0645\u0627\u064b \u0641\u064a \u0627\u0644\u0628\u0631\u0645\u062c\u0629 \u0628\u0627\u0644\u0648\u0635\u0641\u061f", options: ["\u0644\u064a\u0633 \u0645\u0647\u0645\u0627\u064b", "\u064a\u062d\u0633\u0651\u0646 \u0627\u0644\u0623\u0648\u0627\u0645\u0631 \u0648\u0627\u0644\u0645\u062e\u0631\u062c\u0627\u062a \u062d\u062a\u0649 \u064a\u0644\u0628\u064a \u0627\u0644\u062d\u0644 \u0627\u0644\u0645\u062a\u0637\u0644\u0628\u0627\u062a", "\u064a\u062c\u0639\u0644 \u0627\u0644\u0639\u0645\u0644\u064a\u0629 \u0623\u0628\u0637\u0623", "\u064a\u062d\u0644 \u0645\u062d\u0644 \u0627\u0644\u0627\u062e\u062a\u0628\u0627\u0631"], correct: 1 }
    ]
  },
  {
    id: "section-5",
    number: 5,
    title: "Designing AI Automation Solutions & Common Use Cases",
    shortDescription: "This section brings together the concepts from earlier sections and shows learners how to identify automation opportunities, define workflows, insert AI where it adds value, and design useful outputs. It also explores common automation use cases such as operational coordination, communication, decision support, productivity, and monitoring.",
    tags: ["#SolutionDesign", "#AutomationOpportunities", "#AIUseCases", "#WorkflowOptimization", "#DecisionSupport", "#MonitoringAndAlerts", "#OperationalAutomation", "#ProductivityAutomation"],
    pdfUrl: "/module5.pdf",
    pdfUrlAr: "/module5_ar.pdf",
    imageUrl: "/images/module5-designing-solutions.png",
    totalSlides: 10,
    introVideoUrl: "https://www.youtube.com/embed/1VY0m0YKcDs",
    conclusionVideoUrl: "https://www.youtube.com/embed/d733jOBdz04",
    toolIds: ["n8n", "make", "zapier"],
    outcomes: [
      "Identify automation opportunities in workflows",
      "Design AI automation solutions",
      "Describe common use cases across categories"
    ],
    activities: [
      {
        id: "s5-match",
        type: "match",
        title: "Use Case Categories",
        description: "Match each use case to its category",
        pairs: [
          { left: "Automated appointment scheduling", right: "Operational Coordination" },
          { left: "Patient follow-up reminders", right: "Communication" },
          { left: "Flagging abnormal lab results", right: "Decision Support" },
          { left: "Auto-generating shift reports", right: "Productivity" },
          { left: "Tracking medication inventory levels", right: "Monitoring & Alerts" },
          { left: "Routing referrals to specialists", right: "Operational Coordination" }
        ]
      },
      {
        id: "s5-drag",
        type: "dragdrop",
        title: "Solution Design Steps",
        description: "Arrange the solution design process in correct order",
        items: [
          { id: "identify", text: "Identify the problem and repetitive task", order: 1 },
          { id: "map", text: "Map the current workflow", order: 2 },
          { id: "insert", text: "Identify where AI adds value", order: 3 },
          { id: "design", text: "Design the automated workflow", order: 4 },
          { id: "test", text: "Test, refine, and deploy the solution", order: 5 }
        ]
      }
    ],
    moduleQuiz: [
      { question: "What is the first step in designing an AI automation solution?", options: ["Deploy the solution", "Write the code", "Identify the problem and repetitive task", "Purchase software licenses"], correct: 2 },
      { question: "Automated appointment scheduling falls under which use case category?", options: ["Monitoring & Alerts", "Decision Support", "Operational Coordination", "Data Analytics"], correct: 2 },
      { question: "What does 'inserting AI where it adds value' mean?", options: ["Replacing all human workers", "Adding AI capabilities to steps that benefit from intelligence", "Using AI for every single task", "Eliminating workflows entirely"], correct: 1 },
      { question: "Which category does 'flagging abnormal lab results' belong to?", options: ["Communication", "Productivity", "Decision Support", "Operational Coordination"], correct: 2 },
      { question: "What is the final step in the solution design process?", options: ["Identify the problem", "Map the workflow", "Design the automation", "Test, refine, and deploy the solution"], correct: 3 }
    ],
    moduleQuizAr: [
      { question: "\u0645\u0627 \u0647\u064a \u0627\u0644\u062e\u0637\u0648\u0629 \u0627\u0644\u0623\u0648\u0644\u0649 \u0641\u064a \u062a\u0635\u0645\u064a\u0645 \u062d\u0644 \u0623\u062a\u0645\u062a\u0629 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a\u061f", options: ["\u0646\u0634\u0631 \u0627\u0644\u062d\u0644", "\u0643\u062a\u0627\u0628\u0629 \u0627\u0644\u0643\u0648\u062f", "\u062a\u062d\u062f\u064a\u062f \u0627\u0644\u0645\u0634\u0643\u0644\u0629 \u0648\u0627\u0644\u0645\u0647\u0645\u0629 \u0627\u0644\u0645\u062a\u0643\u0631\u0631\u0629", "\u0634\u0631\u0627\u0621 \u062a\u0631\u0627\u062e\u064a\u0635 \u0627\u0644\u0628\u0631\u0627\u0645\u062c"], correct: 2 },
      { question: "\u062c\u062f\u0648\u0644\u0629 \u0627\u0644\u0645\u0648\u0627\u0639\u064a\u062f \u0627\u0644\u0622\u0644\u064a\u0629 \u062a\u0646\u062f\u0631\u062c \u062a\u062d\u062a \u0623\u064a \u0641\u0626\u0629 \u0627\u0633\u062a\u062e\u062f\u0627\u0645\u061f", options: ["\u0627\u0644\u0645\u0631\u0627\u0642\u0628\u0629 \u0648\u0627\u0644\u062a\u0646\u0628\u064a\u0647\u0627\u062a", "\u062f\u0639\u0645 \u0627\u0644\u0642\u0631\u0627\u0631", "\u0627\u0644\u062a\u0646\u0633\u064a\u0642 \u0627\u0644\u062a\u0634\u063a\u064a\u0644\u064a", "\u062a\u062d\u0644\u064a\u0644 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a"], correct: 2 },
      { question: "\u0645\u0627\u0630\u0627 \u064a\u0639\u0646\u064a '\u0625\u062f\u062e\u0627\u0644 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a \u062d\u064a\u062b \u064a\u0636\u064a\u0641 \u0642\u064a\u0645\u0629'\u061f", options: ["\u0627\u0633\u062a\u0628\u062f\u0627\u0644 \u062c\u0645\u064a\u0639 \u0627\u0644\u0639\u0627\u0645\u0644\u064a\u0646", "\u0625\u0636\u0627\u0641\u0629 \u0642\u062f\u0631\u0627\u062a \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a \u0644\u0644\u062e\u0637\u0648\u0627\u062a \u0627\u0644\u062a\u064a \u062a\u0633\u062a\u0641\u064a\u062f \u0645\u0646\u0647", "\u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a \u0644\u0643\u0644 \u0645\u0647\u0645\u0629", "\u0625\u0644\u063a\u0627\u0621 \u0633\u064a\u0631 \u0627\u0644\u0639\u0645\u0644 \u0628\u0627\u0644\u0643\u0627\u0645\u0644"], correct: 1 },
      { question: "\u0623\u064a \u0641\u0626\u0629 \u064a\u0646\u062a\u0645\u064a \u0625\u0644\u064a\u0647\u0627 '\u0627\u0644\u0625\u0628\u0644\u0627\u063a \u0639\u0646 \u0646\u062a\u0627\u0626\u062c \u0627\u0644\u0645\u062e\u062a\u0628\u0631 \u063a\u064a\u0631 \u0627\u0644\u0637\u0628\u064a\u0639\u064a\u0629'\u061f", options: ["\u0627\u0644\u062a\u0648\u0627\u0635\u0644", "\u0627\u0644\u0625\u0646\u062a\u0627\u062c\u064a\u0629", "\u062f\u0639\u0645 \u0627\u0644\u0642\u0631\u0627\u0631", "\u0627\u0644\u062a\u0646\u0633\u064a\u0642 \u0627\u0644\u062a\u0634\u063a\u064a\u0644\u064a"], correct: 2 },
      { question: "\u0645\u0627 \u0647\u064a \u0627\u0644\u062e\u0637\u0648\u0629 \u0627\u0644\u0623\u062e\u064a\u0631\u0629 \u0641\u064a \u0639\u0645\u0644\u064a\u0629 \u062a\u0635\u0645\u064a\u0645 \u0627\u0644\u062d\u0644\u061f", options: ["\u062a\u062d\u062f\u064a\u062f \u0627\u0644\u0645\u0634\u0643\u0644\u0629", "\u0631\u0633\u0645 \u062e\u0631\u064a\u0637\u0629 \u0633\u064a\u0631 \u0627\u0644\u0639\u0645\u0644", "\u062a\u0635\u0645\u064a\u0645 \u0627\u0644\u0623\u062a\u0645\u062a\u0629", "\u0627\u062e\u062a\u0628\u0627\u0631 \u0648\u062a\u062d\u0633\u064a\u0646 \u0648\u0646\u0634\u0631 \u0627\u0644\u062d\u0644"], correct: 3 }
    ]
  }
];

export const tools = [
  {
    id: "lovable",
    name: "Lovable",
    tagline: "Vibe coding platform — build apps with natural language",
    description: "Lovable is a vibe coding platform that allows users to create applications by describing what they want in natural language. Instead of manually building the interface and writing code from scratch, the user gives prompts, and the platform generates the application structure, screens, and logic. It enables rapid prototyping without traditional coding skills.",
    healthcareUseCase: "In this demo scenario, a doctor wants a simple app to record diabetic patient information, store glucose readings, detect potentially dangerous values, and review detailed patient records over time. Using three prompts, a basic healthcare app is created and iteratively improved with alert logic and trend tracking.",
    videoUrl: "https://www.youtube.com/embed/yMeHhoqnMbM",
    demoPrompts: [
      { title: "Prompt 1: Basic Diabetic Patient Recording App", prompt: "Create a healthcare app for doctors to record diabetic patient data. The app should allow the doctor to enter patient name, age, gender, date, blood glucose reading, blood pressure, and notes. It should have a clean and simple interface and save each patient's daily record." },
      { title: "Prompt 2: Add Emergency Detection", prompt: 'Enhance the app by adding an alert system. If the blood glucose reading is above 180, show a warning message saying \"High glucose level – attention required.\" If the reading is above 250, show a more urgent alert saying \"Critical reading – immediate medical attention may be needed.\" Make these alerts visually clear on the interface.' },
      { title: "Prompt 3: Detailed Patient View", prompt: "Add a patient details page where the doctor can click on a patient and view their daily glucose records over time. Show readings by date, display trends clearly, and include notes for each visit. Make the dashboard easy to read and useful for follow-up review." }
    ],
    summaryPoints: [
      "Describe your app idea in natural language — no coding required",
      "AI generates a complete, functional web application instantly",
      "Iterate and refine through follow-up conversational prompts",
      "Build healthcare apps with alert logic and patient tracking",
      "Ideal for rapid prototyping: from idea to working app in minutes"
    ],
    quiz: [
      { question: "What is the primary input method for Lovable?", options: ["Writing code", "Natural language prompts", "Drag and drop", "Visual templates"], correct: 1 },
      { question: "In the Lovable demo, what was the main healthcare example used?", options: ["Hospital building design", "Diabetic patient tracking application", "Insurance claims engine", "Medical image generation system"], correct: 1 },
      { question: "What does Lovable generate from your prompts?", options: ["Documentation only", "A working web application", "A project plan", "Test cases"], correct: 1 }
    ]
  },
  {
    id: "replit",
    name: "Replit",
    tagline: "AI-assisted development platform",
    description: "Replit is an AI-assisted development platform that allows users to create, edit, run, and test applications in the browser. It combines a coding workspace, AI support, app preview, and rapid prototyping — all from your browser with no setup required.",
    healthcareUseCase: "In this demo scenario, we create a simple clinical report generator for a doctor. The app accepts patient symptoms as input, generates a short clinical summary, classifies urgency level (Low, Medium, High), and allows export or structured output for documentation purposes.",
    videoUrl: "https://www.youtube.com/embed/t2AcMs3wbh0",
    demoPrompts: [
      { title: "Prompt 1: Create Clinical Summary App", prompt: "Create a simple web app for doctors where they can enter patient symptoms and generate a clinical summary. The app should include input fields for patient name, age, symptoms, and notes. It should have a clean interface and display the generated summary clearly." },
      { title: "Prompt 2: Add Urgency Classification", prompt: "Enhance the app by adding an urgency classification section. Based on the entered symptoms, show a simple urgency level such as Low, Medium, or High. Display the urgency clearly below the clinical summary." },
      { title: "Prompt 3: Add Structured Output and Download", prompt: "Improve the app by formatting the output into clear sections: patient details, symptoms, clinical summary, and urgency level. Also add a button that allows the doctor to download or print the result for documentation purposes." }
    ],
    summaryPoints: [
      "Cloud-based development environment — no installation needed",
      "AI assistant helps write, debug, and explain code",
      "Build, test, and deploy from your browser",
      "Supports multiple programming languages",
      "Great for collaborative healthcare tool development and rapid prototyping"
    ],
    quiz: [
      { question: "What type of environment does Replit provide?", options: ["Desktop IDE", "Cloud-based development", "Mobile app", "Command line only"], correct: 1 },
      { question: "In the Replit demo, what additional feature was added after generating the initial clinical summary app?", options: ["Hospital map view", "Urgency classification", "Appointment payment system", "Pharmacy ordering module"], correct: 1 },
      { question: "What is a key advantage of Replit for healthcare teams?", options: ["It's only for experts", "It requires local installation", "It enables browser-based collaborative development", "It only works with Python"], correct: 2 }
    ]
  },
  {
    id: "claude-code",
    name: "Claude Code",
    tagline: "Agentic coding tool for prompt-driven development",
    description: "Claude Code is an agentic coding tool that enables prompt-driven development workflows. Users describe what they want to build and Claude generates, explains, and refines code through natural conversation. It supports complex multi-file projects and iterative refinement.",
    healthcareUseCase: "Build a Medication Adherence Tracker for a clinic. The app allows a doctor or care coordinator to record patient name, medication name, dosage, date, and whether the medication was taken. Alerts are shown for missed doses, with stronger alerts for consecutive missed days. A patient history dashboard shows adherence trends over time.",
    videoUrl: null,
    comingSoon: true,
    demoPrompts: [
      { title: "Prompt 1: Create Medication Tracker", prompt: "Create a simple web app for a clinic to track patient medication adherence. The app should allow the doctor or care coordinator to enter patient name, medication name, dosage, date, and whether the medication was taken. The interface should be clean and simple, and each patient should have a saved daily medication record." },
      { title: "Prompt 2: Add Missed Dose Alerts", prompt: 'Enhance the app by adding an alert when a patient misses medication. If the status is marked as \"not taken\" for a daily record, show a warning message saying \"Missed dose – follow-up recommended.\" If a patient misses medication for two or more consecutive days, show a stronger alert saying \"Repeated missed doses – intervention may be required.\"' },
      { title: "Prompt 3: Add History Dashboard", prompt: "Add a patient details page where the doctor can click on a patient and view medication adherence history over time. Show daily records by date, indicate whether medication was taken or missed, and display a simple adherence trend summary." }
    ],
    summaryPoints: [
      "Conversational coding through natural language prompts",
      "Generates, explains, and refines code iteratively",
      "Supports complex multi-file projects",
      "Helps non-programmers build working solutions",
      "Excellent for healthcare workflow automation scripts"
    ],
    quiz: [
      { question: "What is Claude Code's primary interface for coding?", options: ["Visual drag and drop", "Natural language conversation", "Template selection", "Block-based programming"], correct: 1 },
      { question: "What can Claude Code do beyond generating code?", options: ["Nothing else", "Explain and refine the code", "Only fix bugs", "Only write documentation"], correct: 1 },
      { question: "How can healthcare teams benefit from Claude Code?", options: ["Replace all IT staff", "Build workflow automation through prompts", "Only for data science", "Only for web design"], correct: 1 }
    ]
  },
  {
    id: "n8n",
    name: "n8n",
    tagline: "Visual workflow automation platform",
    description: "n8n is an open-source workflow automation platform that allows users to connect apps, services, and APIs through a visual node-based interface. It supports complex multi-step automations with conditional logic, wait steps, and AI generation nodes.",
    healthcareUseCase: "Automate a patient follow-up reminder workflow: when a patient visit is marked as completed, the workflow waits 7 days, then uses AI to generate a personalized follow-up message reminding the patient to monitor glucose levels and follow medication instructions, and sends it via email or SMS.",
    videoUrl: null,
    comingSoon: true,
    summaryPoints: [
      "Visual node-based workflow builder",
      "Open-source and self-hostable",
      "Connects hundreds of apps and services",
      "Supports conditional logic and branching",
      "Ideal for complex healthcare workflow automation"
    ],
    quiz: [
      { question: "What type of interface does n8n use?", options: ["Command line", "Visual node-based", "Spreadsheet", "Natural language only"], correct: 1 },
      { question: "What is a key advantage of n8n being open-source?", options: ["It's less reliable", "It can be self-hosted for data privacy", "It has fewer features", "It doesn't support integrations"], correct: 1 },
      { question: "Which healthcare process could n8n automate?", options: ["Surgery procedures", "Patient referral routing and notifications", "Physical therapy exercises", "Medical imaging"], correct: 1 }
    ]
  },
  {
    id: "make",
    name: "Make",
    tagline: "Multi-step automation and coordination",
    description: "Make (formerly Integromat) is a visual automation platform for creating multi-step workflows that connect apps and services. It excels at complex scenarios with parallel paths, error handling, and data transformation.",
    healthcareUseCase: "Create a multi-step patient onboarding workflow: collect patient information, verify insurance, schedule initial appointment, send welcome packet, and set up patient portal access — all triggered automatically.",
    videoUrl: "https://www.youtube.com/embed/v1DDB1UgK0o",
    summaryPoints: [
      "Visual scenario builder with drag-and-drop",
      "Supports parallel execution paths",
      "Advanced data transformation and mapping",
      "Built-in error handling and retry logic",
      "Perfect for multi-step healthcare coordination"
    ],
    quiz: [
      { question: "What was Make formerly known as?", options: ["Zapier", "Integromat", "IFTTT", "Automate.io"], correct: 1 },
      { question: "What does Make excel at compared to simpler tools?", options: ["Single-step tasks", "Complex multi-step scenarios with parallel paths", "Only email automation", "Database management"], correct: 1 },
      { question: "How could Make improve patient onboarding?", options: ["By replacing doctors", "By automating multi-step verification and setup processes", "By creating medical records", "By diagnosing conditions"], correct: 1 }
    ]
  },
  {
    id: "zapier",
    name: "Zapier",
    tagline: "Trigger-based operational automation",
    description: "Zapier is a trigger-based automation platform that connects thousands of apps using simple if-this-then-that logic. It's designed for ease of use and allows anyone to create automations called 'Zaps' without coding. It also supports AI-generated messages within workflows.",
    healthcareUseCase: "Automate appointment coordination: when a new booking is received, Zapier sends an automated confirmation email, creates a calendar event for the doctor/clinic, and uses AI to generate a short, professional reminder message with date, time, and instructions. Also supports lab result notification workflows where AI generates patient-friendly messages when new results are added.",
    videoUrl: "https://www.youtube.com/embed/y_kmHVZQdFY",
    summaryPoints: [
      "Simple trigger-action automation (Zaps)",
      "Connects 5,000+ apps and services",
      "No coding required",
      "Easy to set up and maintain",
      "Great for healthcare communication and coordination"
    ],
    quiz: [
      { question: "What are Zapier's automations called?", options: ["Flows", "Recipes", "Zaps", "Scripts"], correct: 2 },
      { question: "How many apps can Zapier connect to?", options: ["About 50", "About 500", "Over 5,000", "Only 10"], correct: 2 },
      { question: "What is Zapier's primary automation pattern?", options: ["AI-driven decisions", "Trigger-action (if this, then that)", "Manual workflows", "Batch processing"], correct: 1 }
    ]
  }
];

export const finalExamQuestions = [
  // Section 1 questions
  { id: 1, section: "Section 1", type: "multiple-choice", question: "What is automation?", options: ["Using technology to perform tasks with minimal human intervention", "Replacing all human workers with machines", "Only using robots in manufacturing", "Writing computer programs"], correct: 0 },
  { id: 2, section: "Section 1", type: "true-false", question: "Traditional automation uses context-aware, adaptive logic to handle unstructured data.", correct: false },
  { id: 3, section: "Section 1", type: "multiple-choice", question: "Which type of automation connects multiple steps into a unified workflow?", options: ["Task Automation", "Process Automation", "Intelligent Automation", "Manual Automation"], correct: 1 },
  { id: 4, section: "Section 1", type: "multiple-choice", question: "What is an example of Intelligent Automation?", options: ["Sending a confirmation email", "Creating a calendar entry", "Classifying and routing support tickets using AI", "Saving data to a spreadsheet"], correct: 2 },
  
  // Section 2 questions
  { id: 5, section: "Section 2", type: "multiple-choice", question: "What is the first element in a typical workflow?", options: ["Action", "Output", "Trigger", "Condition"], correct: 2 },
  { id: 6, section: "Section 2", type: "true-false", question: "A condition in a workflow checks whether certain criteria are met before proceeding.", correct: true },
  { id: 7, section: "Section 2", type: "multiple-choice", question: "Which workflow component represents the final result delivered to the user?", options: ["Trigger", "Action", "Condition", "Output"], correct: 3 },
  { id: 8, section: "Section 2", type: "scenario", question: "A hospital wants to automate appointment reminders. When an appointment is scheduled, the system checks if it's within 24 hours, then sends an SMS reminder. What is the 'condition' in this workflow?", options: ["Appointment is scheduled", "Checking if appointment is within 24 hours", "Sending SMS reminder", "Patient receives notification"], correct: 1 },
  
  // Section 3 questions
  { id: 9, section: "Section 3", type: "multiple-choice", question: "What distinguishes AI agents from standard automation?", options: ["They are faster", "They can interpret context, decide, and adapt", "They use more electricity", "They only work in the cloud"], correct: 1 },
  { id: 10, section: "Section 3", type: "true-false", question: "AI agents can only follow fixed, predetermined rules and cannot adapt to new situations.", correct: false },
  { id: 11, section: "Section 3", type: "multiple-choice", question: "Which capability allows AI agents to understand patient messages?", options: ["Data Storage", "Natural Language Understanding", "File Management", "Network Security"], correct: 1 },
  
  // Section 4 questions
  { id: 12, section: "Section 4", type: "multiple-choice", question: "What is vibe coding?", options: ["A new programming language", "Creating solutions using natural language prompts instead of traditional coding", "A type of database", "A testing framework"], correct: 1 },
  { id: 13, section: "Section 4", type: "true-false", question: "Vibe coding requires extensive programming experience to get started.", correct: false },
  { id: 14, section: "Section 4", type: "multiple-choice", question: "What is the core loop of vibe coding?", options: ["Plan → Code → Test", "Describe → Generate → Refine", "Design → Build → Deploy", "Research → Develop → Publish"], correct: 1 },
  
  // Section 5 questions
  { id: 15, section: "Section 5", type: "multiple-choice", question: "What is the first step in designing an AI automation solution?", options: ["Deploy the solution", "Write the code", "Identify the problem and repetitive task", "Purchase software licenses"], correct: 2 },
  { id: 16, section: "Section 5", type: "scenario", question: "A clinic notices that nurses spend 2 hours daily manually calling patients to confirm next-day appointments. Which automation use case category does this fall under?", options: ["Monitoring & Alerts", "Decision Support", "Communication", "Data Analytics"], correct: 2 },
  { id: 17, section: "Section 5", type: "true-false", question: "Common automation use cases include operational coordination, communication, decision support, productivity, and monitoring.", correct: true },
  
  // Tool questions
  { id: 18, section: "Tools", type: "multiple-choice", question: "Which tool uses natural language prompts to generate complete web applications?", options: ["n8n", "Zapier", "Lovable", "Make"], correct: 2 },
  { id: 19, section: "Tools", type: "multiple-choice", question: "What are Zapier's automations called?", options: ["Scenarios", "Workflows", "Zaps", "Recipes"], correct: 2 },
  { id: 20, section: "Tools", type: "multiple-choice", question: "Which tool is open-source and can be self-hosted for data privacy?", options: ["Zapier", "Lovable", "n8n", "Replit"], correct: 2 },
  { id: 21, section: "Tools", type: "scenario", question: "A healthcare administrator wants to build a quick prototype of a patient feedback form without coding. Which tool would be most appropriate?", options: ["n8n", "Lovable", "Make", "n8n"], correct: 1 },
  { id: 22, section: "Tools", type: "true-false", question: "Make (formerly Integromat) supports parallel execution paths in its automation scenarios.", correct: true },
  { id: 23, section: "Tools", type: "multiple-choice", question: "Which tool provides a cloud-based development environment with AI coding assistance?", options: ["Zapier", "Make", "Replit", "n8n"], correct: 2 },
  { id: 24, section: "Tools", type: "multiple-choice", question: "Claude Code primarily helps users by:", options: ["Providing visual workflow builders", "Generating and explaining code through conversation", "Connecting apps with triggers", "Creating database schemas"], correct: 1 },
  { id: 25, section: "Tools", type: "scenario", question: "A hospital needs to automate a complex patient referral process involving multiple departments, conditional routing, and error handling. Which tool is best suited?", options: ["Lovable", "Claude Code", "n8n or Make", "Replit"], correct: 2 }
];

/* ── Skill ↔ Question mapping for Radar Chart ── */
export const skillQuestionMap = [
  {
    skill: "AI Automation Fundamentals",
    shortLabel: "AI Automation",
    questionIds: [1, 2, 3, 4],
    relatedSections: ["section-1"],
    moduleLabel: "Module 1: Introduction to AI Automation"
  },
  {
    skill: "Workflow Design",
    shortLabel: "Workflow Design",
    questionIds: [5, 6, 7, 8],
    relatedSections: ["section-2"],
    moduleLabel: "Module 2: Workflow Thinking"
  },
  {
    skill: "AI Agents Awareness",
    shortLabel: "AI Agents",
    questionIds: [9, 10, 11],
    relatedSections: ["section-3"],
    moduleLabel: "Module 3: AI Agents"
  },
  {
    skill: "Vibe Coding Fundamentals",
    shortLabel: "Vibe Coding",
    questionIds: [12, 13, 14],
    relatedSections: ["section-4"],
    moduleLabel: "Module 4: Vibe Coding"
  },
  {
    skill: "AI-Assisted Solution Design",
    shortLabel: "Solution Design",
    questionIds: [15, 16, 17],
    relatedSections: ["section-5"],
    moduleLabel: "Module 5: Designing AI Automation Solutions"
  },
  {
    skill: "Workflow Automation Tools Awareness",
    shortLabel: "Tools Awareness",
    questionIds: [18, 19, 20, 21, 22, 23, 24, 25],
    relatedSections: [],
    moduleLabel: "Tool Demonstrations"
  }
];

/* ── Arabic Final Exam Questions ── */
export const finalExamQuestionsAr = [
  // القسم 1
  { id: 1, section: "القسم 1", type: "multiple-choice", typeLabel: "اختيار متعدد", question: "ما هي الأتمتة؟", options: ["استخدام التكنولوجيا لأداء المهام بأقل تدخل بشري", "استبدال جميع العمال البشريين بالآلات", "استخدام الروبوتات في التصنيع فقط", "كتابة برامج الحاسوب"], correct: 0 },
  { id: 2, section: "القسم 1", type: "true-false", typeLabel: "صح أو خطأ", question: "تستخدم الأتمتة التقليدية منطقًا تكيفيًا واعيًا للسياق للتعامل مع البيانات غير المنظمة.", correct: false },
  { id: 3, section: "القسم 1", type: "multiple-choice", typeLabel: "اختيار متعدد", question: "أي نوع من الأتمتة يربط خطوات متعددة في سير عمل موحد؟", options: ["أتمتة المهام", "أتمتة العمليات", "الأتمتة الذكية", "الأتمتة اليدوية"], correct: 1 },
  { id: 4, section: "القسم 1", type: "multiple-choice", typeLabel: "اختيار متعدد", question: "ما هو مثال على الأتمتة الذكية؟", options: ["إرسال بريد تأكيد", "إنشاء إدخال في التقويم", "تصنيف وتوجيه تذاكر الدعم باستخدام الذكاء الاصطناعي", "حفظ البيانات في جدول بيانات"], correct: 2 },

  // القسم 2
  { id: 5, section: "القسم 2", type: "multiple-choice", typeLabel: "اختيار متعدد", question: "ما هو العنصر الأول في سير العمل النموذجي؟", options: ["الإجراء", "المخرج", "المحفز", "الشرط"], correct: 2 },
  { id: 6, section: "القسم 2", type: "true-false", typeLabel: "صح أو خطأ", question: "يتحقق الشرط في سير العمل مما إذا كانت معايير معينة مستوفاة قبل المتابعة.", correct: true },
  { id: 7, section: "القسم 2", type: "multiple-choice", typeLabel: "اختيار متعدد", question: "أي مكون من مكونات سير العمل يمثل النتيجة النهائية المقدمة للمستخدم؟", options: ["المحفز", "الإجراء", "الشرط", "المخرج"], correct: 3 },
  { id: 8, section: "القسم 2", type: "scenario", typeLabel: "سيناريو", question: "يريد مستشفى أتمتة تذكيرات المواعيد. عند جدولة موعد، يتحقق النظام مما إذا كان خلال 24 ساعة، ثم يرسل تذكيرًا عبر رسالة نصية. ما هو 'الشرط' في سير العمل هذا؟", options: ["جدولة الموعد", "التحقق مما إذا كان الموعد خلال 24 ساعة", "إرسال تذكير عبر رسالة نصية", "استلام المريض للإشعار"], correct: 1 },

  // القسم 3
  { id: 9, section: "القسم 3", type: "multiple-choice", typeLabel: "اختيار متعدد", question: "ما الذي يميز وكلاء الذكاء الاصطناعي عن الأتمتة العادية؟", options: ["أسرع", "يمكنهم تفسير السياق واتخاذ القرارات والتكيف", "يستخدمون طاقة أكثر", "يعملون في السحابة فقط"], correct: 1 },
  { id: 10, section: "القسم 3", type: "true-false", typeLabel: "صح أو خطأ", question: "يمكن لوكلاء الذكاء الاصطناعي فقط اتباع قواعد ثابتة محددة مسبقًا ولا يمكنهم التكيف مع المواقف الجديدة.", correct: false },
  { id: 11, section: "القسم 3", type: "multiple-choice", typeLabel: "اختيار متعدد", question: "أي قدرة تسمح لوكلاء الذكاء الاصطناعي بفهم رسائل المرضى؟", options: ["تخزين البيانات", "فهم اللغة الطبيعية", "إدارة الملفات", "أمن الشبكات"], correct: 1 },

  // القسم 4
  { id: 12, section: "القسم 4", type: "multiple-choice", typeLabel: "اختيار متعدد", question: "ما هي البرمجة بالوصف؟", options: ["لغة برمجة جديدة", "إنشاء حلول باستخدام أوامر نصية طبيعية بدلاً من البرمجة التقليدية", "نوع من قواعد البيانات", "إطار عمل للاختبار"], correct: 1 },
  { id: 13, section: "القسم 4", type: "true-false", typeLabel: "صح أو خطأ", question: "تتطلب البرمجة بالوصف خبرة واسعة في البرمجة للبدء.", correct: false },
  { id: 14, section: "القسم 4", type: "multiple-choice", typeLabel: "اختيار متعدد", question: "ما هي الحلقة الأساسية للبرمجة بالوصف؟", options: ["خطط ← برمج ← اختبر", "صف ← ولّد ← حسّن", "صمم ← ابنِ ← انشر", "ابحث ← طوّر ← انشر"], correct: 1 },

  // القسم 5
  { id: 15, section: "القسم 5", type: "multiple-choice", typeLabel: "اختيار متعدد", question: "ما هي الخطوة الأولى في تصميم حل أتمتة الذكاء الاصطناعي؟", options: ["نشر الحل", "كتابة الكود", "تحديد المشكلة والمهمة المتكررة", "شراء تراخيص البرامج"], correct: 2 },
  { id: 16, section: "القسم 5", type: "scenario", typeLabel: "سيناريو", question: "لاحظت عيادة أن الممرضات يقضين ساعتين يوميًا في الاتصال بالمرضى يدويًا لتأكيد مواعيد اليوم التالي. تحت أي فئة من حالات استخدام الأتمتة يندرج هذا؟", options: ["المراقبة والتنبيهات", "دعم القرار", "التواصل", "تحليل البيانات"], correct: 2 },
  { id: 17, section: "القسم 5", type: "true-false", typeLabel: "صح أو خطأ", question: "تشمل حالات الاستخدام الشائعة للأتمتة التنسيق التشغيلي والتواصل ودعم القرار والإنتاجية والمراقبة.", correct: true },

  // أسئلة الأدوات
  { id: 18, section: "الأدوات", type: "multiple-choice", typeLabel: "اختيار متعدد", question: "أي أداة تستخدم أوامر نصية طبيعية لإنشاء تطبيقات ويب كاملة؟", options: ["n8n", "Zapier", "Lovable", "Make"], correct: 2 },
  { id: 19, section: "الأدوات", type: "multiple-choice", typeLabel: "اختيار متعدد", question: "ماذا تسمى أتمتة Zapier؟", options: ["Scenarios", "Workflows", "Zaps", "Recipes"], correct: 2 },
  { id: 20, section: "الأدوات", type: "multiple-choice", typeLabel: "اختيار متعدد", question: "أي أداة مفتوحة المصدر ويمكن استضافتها ذاتيًا لخصوصية البيانات؟", options: ["Zapier", "Lovable", "n8n", "Replit"], correct: 2 },
  { id: 21, section: "الأدوات", type: "scenario", typeLabel: "سيناريو", question: "يريد مسؤول رعاية صحية بناء نموذج أولي سريع لنموذج ملاحظات المرضى بدون برمجة. أي أداة هي الأنسب؟", options: ["n8n", "Lovable", "Make", "n8n"], correct: 1 },
  { id: 22, section: "الأدوات", type: "true-false", typeLabel: "صح أو خطأ", question: "يدعم Make (المعروف سابقًا بـ Integromat) مسارات التنفيذ المتوازي في سيناريوهات الأتمتة.", correct: true },
  { id: 23, section: "الأدوات", type: "multiple-choice", typeLabel: "اختيار متعدد", question: "أي أداة توفر بيئة تطوير سحابية مع مساعدة الذكاء الاصطناعي في البرمجة؟", options: ["Zapier", "Make", "Replit", "n8n"], correct: 2 },
  { id: 24, section: "الأدوات", type: "multiple-choice", typeLabel: "اختيار متعدد", question: "يساعد Claude Code المستخدمين بشكل أساسي من خلال:", options: ["توفير منشئ سير عمل مرئي", "إنشاء وشرح الكود من خلال المحادثة", "ربط التطبيقات بالمحفزات", "إنشاء مخططات قواعد البيانات"], correct: 1 },
  { id: 25, section: "الأدوات", type: "scenario", typeLabel: "سيناريو", question: "يحتاج مستشفى لأتمتة عملية إحالة مرضى معقدة تتضمن أقسامًا متعددة وتوجيهًا شرطيًا ومعالجة الأخطاء. أي أداة هي الأنسب؟", options: ["Lovable", "Claude Code", "n8n أو Make", "Replit"], correct: 2 }
];

/* ── Arabic Skill ↔ Question mapping for Radar Chart ── */
export const skillQuestionMapAr = [
  {
    skill: "أساسيات أتمتة الذكاء الاصطناعي",
    shortLabel: "أتمتة الذكاء الاصطناعي",
    questionIds: [1, 2, 3, 4],
    relatedSections: ["section-1"],
    moduleLabel: "الوحدة 1: مقدمة في أتمتة الذكاء الاصطناعي"
  },
  {
    skill: "تصميم سير العمل",
    shortLabel: "تصميم سير العمل",
    questionIds: [5, 6, 7, 8],
    relatedSections: ["section-2"],
    moduleLabel: "الوحدة 2: التفكير في سير العمل"
  },
  {
    skill: "الوعي بوكلاء الذكاء الاصطناعي",
    shortLabel: "وكلاء الذكاء الاصطناعي",
    questionIds: [9, 10, 11],
    relatedSections: ["section-3"],
    moduleLabel: "الوحدة 3: وكلاء الذكاء الاصطناعي"
  },
  {
    skill: "أساسيات البرمجة بالوصف",
    shortLabel: "البرمجة بالوصف",
    questionIds: [12, 13, 14],
    relatedSections: ["section-4"],
    moduleLabel: "الوحدة 4: البرمجة بالوصف"
  },
  {
    skill: "تصميم الحلول بمساعدة الذكاء الاصطناعي",
    shortLabel: "تصميم الحلول",
    questionIds: [15, 16, 17],
    relatedSections: ["section-5"],
    moduleLabel: "الوحدة 5: تصميم حلول أتمتة الذكاء الاصطناعي"
  },
  {
    skill: "الوعي بأدوات أتمتة سير العمل",
    shortLabel: "الوعي بالأدوات",
    questionIds: [18, 19, 20, 21, 22, 23, 24, 25],
    relatedSections: [],
    moduleLabel: "العروض التوضيحية للأدوات"
  }
];

/* ── Section estimated durations (minutes) ── */
export const sectionDurations = {
  "section-1": 20,
  "section-2": 20,
  "section-3": 25,
  "section-4": 20,
  "section-5": 25
};

/* ── Arabic Course Info ── */
export const courseInfoAr = {
  title: "أتمتة الذكاء الاصطناعي والبرمجة بالوصف",
  subtitle: "إنتاجية الذكاء الاصطناعي التطبيقية والوكلاء والأتمتة للرعاية الصحية",
  catalogSummary: "دورة تمهيدية عملية حول أتمتة الذكاء الاصطناعي وتصميم سير العمل ووكلاء الذكاء الاصطناعي والبرمجة بالوصف، مع عروض توضيحية لأدوات موجهة للرعاية الصحية باستخدام Lovable وReplit وClaude Code وn8n وMake وZapier.",
  sector: "الرعاية الصحية",
  audience: "الجميع",
  duration: "ساعتان",
  level: "مبتدئ إلى متوسط",
  deliveryMode: "ذاتي السرعة",
  courseType: "ذكاء اصطناعي تطبيقي / إنتاجية / أتمتة",
  passingScore: 70,
  description: "تقدم هذه الدورة للمتعلمين أساسيات أتمتة الذكاء الاصطناعي وتصميم سير العمل ووكلاء الذكاء الاصطناعي والبرمجة بالوصف، مع أمثلة عملية مصممة لقطاع الرعاية الصحية. وهي مصممة لمساعدة المتعلمين على فهم كيفية استخدام الذكاء الاصطناعي لأتمتة المهام المتكررة وتحسين سير العمل التشغيلي ودعم اتخاذ القرارات وتمكين الإنشاء السريع للحلول الرقمية من خلال الأوامر النصية.",
  fullDescription: "تبدأ الدورة بأسس الأتمتة والتفكير في سير العمل، ثم تنتقل إلى وكلاء الذكاء الاصطناعي والبرمجة بالوصف كطرق جديدة لبناء الحلول وتحسينها. كما تستكشف كيفية تصميم حلول أتمتة الذكاء الاصطناعي وتحديد حالات الاستخدام الشائعة عبر بيئات العمل. بالإضافة إلى الوحدات المفاهيمية، سيتعرف المتعلمون على أدوات عملية مثل Lovable وReplit وClaude Code وn8n وMake وZapier من خلال عروض توضيحية خاصة بالرعاية الصحية.",
  objective: "تزويد المتعلمين بالمعرفة والفهم العملي اللازمين لتحديد وتصميم وتطبيق أساليب أتمتة الذكاء الاصطناعي والبرمجة بالوصف على سير العمل الواقعي، مع أمثلة ذات صلة بالرعاية الصحية.",
  whyMatters: "غالبًا ما تتضمن بيئات الرعاية الصحية أعمالًا إدارية متكررة ومتابعات يدوية وعبء توثيق وتواصل مجزأ وتنسيق حساس للوقت. يمكن لأتمتة الذكاء الاصطناعي والبرمجة بالوصف المساعدة في مواجهة هذه التحديات من خلال تمكين سير عمل أسرع ودعم قرارات أذكى ونمذجة سريعة للحلول العملية.",
  prerequisites: "لا تتطلب خبرة سابقة في البرمجة. المعرفة الرقمية الأساسية والإلمام العام بأدوات الذكاء الاصطناعي مفيدة لكنها ليست إلزامية.",
  targetAudience: "المتخصصون في الرعاية الصحية، موظفو العمليات، المديرون، المنسقون، المحللون، فرق الابتكار، المتعلمون غير التقنيين، وأي شخص مهتم بالإنتاجية والأتمتة المدعومة بالذكاء الاصطناعي."
};

export const learningOutcomesAr = [
  "شرح مفهوم الأتمتة والتمييز بين الأتمتة التقليدية وأتمتة الذكاء الاصطناعي",
  "وصف هيكل سير العمل باستخدام المحفزات والإجراءات والشروط والمخرجات",
  "شرح ماهية وكلاء الذكاء الاصطناعي وكيف يدعمون تنفيذ سير العمل الذكي",
  "فهم مفهوم البرمجة بالوصف وكيفية عمل التطوير القائم على الأوامر النصية",
  "تحديد الفرص المناسبة لأتمتة الذكاء الاصطناعي في عمليات العمل",
  "وصف حالات الاستخدام الشائعة للأتمتة عبر الإنتاجية والتواصل ودعم القرار والمراقبة",
  "فهم كيفية استخدام الأدوات العملية مثل Lovable وReplit وClaude Code وn8n وMake وZapier في سيناريوهات الرعاية الصحية",
  "إدراك كيف يمكن لأتمتة الذكاء الاصطناعي والبرمجة بالوصف تحسين الإنتاجية وكفاءة سير العمل في سياقات الرعاية الصحية"
];

export const skillsAr = [
  "أساسيات أتمتة الذكاء الاصطناعي",
  "تصميم سير العمل",
  "الوعي بوكلاء الذكاء الاصطناعي",
  "هندسة الأوامر النصية لإنشاء التطبيقات",
  "أساسيات البرمجة بالوصف",
  "تحديد حالات استخدام الأتمتة",
  "أتمتة إنتاجية الرعاية الصحية",
  "تصميم الحلول بمساعدة الذكاء الاصطناعي",
  "الوعي بأدوات أتمتة سير العمل"
];

export const sectionsAr = [
  {
    title: "مقدمة في أتمتة الذكاء الاصطناعي",
    shortDescription: "يقدم هذا القسم مفهوم الأتمتة ويشرح كيف تطورت من الأنظمة التقليدية القائمة على القواعد إلى الأتمتة المدعومة بالذكاء الاصطناعي. سيفهم المتعلمون الفرق بين أتمتة المهام وأتمتة العمليات والأتمتة الذكية، ولماذا تهم هذه الأساليب في بيئات العمل الحديثة.",
    outcomes: [
      "تعريف معنى الأتمتة",
      "التمييز بين الأتمتة التقليدية وأتمتة الذكاء الاصطناعي",
      "تحديد الأنواع الثلاثة الأساسية للأتمتة"
    ],
    tags: ["#أساسيات_الأتمتة", "#الأتمتة_التقليدية", "#أتمتة_الذكاء_الاصطناعي", "#أتمتة_المهام", "#أتمتة_العمليات", "#الأتمتة_الذكية"],
    activities: [
      {
        id: "s1-match",
        type: "match",
        title: "الأتمتة التقليدية مقابل أتمتة الذكاء الاصطناعي",
        description: "طابق كل مفهوم مع نوع الأتمتة الصحيح",
        pairs: [
          { left: "قواعد ثابتة: إذا حدث X، افعل Y", right: "الأتمتة التقليدية" },
          { left: "معالجة واعية للسياق", right: "أتمتة الذكاء الاصطناعي" },
          { left: "تتعامل مع البيانات المنظمة فقط", right: "الأتمتة التقليدية" },
          { left: "تعالج النصوص والصور غير المنظمة", right: "أتمتة الذكاء الاصطناعي" },
          { left: "منطق قرار تكيفي", right: "أتمتة الذكاء الاصطناعي" },
          { left: "سير عمل جامد محدد مسبقًا", right: "الأتمتة التقليدية" }
        ]
      },
      {
        id: "s1-flash",
        type: "flashcard",
        title: "بطاقات أنواع الأتمتة",
        description: "مراجعة الأنواع الثلاثة للأتمتة",
        cards: [
          { front: "أتمتة المهام", back: "أتمتة إجراء واحد منفصل. أمثلة: إرسال بريد تأكيد، إنشاء إدخال في التقويم، الحفظ في جدول بيانات." },
          { front: "أتمتة العمليات", back: "ربط خطوات متعددة في سير عمل موحد. أمثلة: تدفق تهيئة الموارد البشرية، خط معالجة الطلبات." },
          { front: "الأتمتة الذكية", back: "تجمع بين الأتمتة وقدرات الذكاء الاصطناعي مثل التنبؤ والتصنيف والتوصية. أمثلة: تصنيف وتوجيه التذاكر، تلخيص النصوص، اكتشاف الشذوذ." },
          { front: "الأتمتة التقليدية", back: "تستخدم منطقًا ثابتًا قائمًا على القواعد (إذا حدث X، افعل Y). تعمل بشكل جيد للمهام المنظمة والمتوقعة لكنها لا تستطيع التعامل مع الاستثناءات أو البيانات غير المنظمة." },
          { front: "أتمتة الذكاء الاصطناعي", back: "أتمتة واعية للسياق يمكنها التعامل مع البيانات غير المنظمة والتكيف مع المواقف الجديدة واتخاذ قرارات ذكية." }
        ]
      }
    ]
  },
  {
    title: "التفكير في سير العمل",
    shortDescription: "يشرح هذا القسم كيفية تنظيم العمل في سير العمل ولماذا يعد التفكير في سير العمل ضروريًا لتصميم الأتمتة. سيستكشف المتعلمون مكونات بناء سير العمل مثل المحفزات والإجراءات والشروط والمخرجات، ويتعلمون كيفية تقسيم العملية إلى خطوات منظمة.",
    outcomes: [
      "فهم هيكل ومكونات سير العمل",
      "تحديد المحفزات والإجراءات والشروط والمخرجات",
      "تخطيط عملية في سير عمل منظم"
    ],
    tags: ["#التفكير_في_سير_العمل", "#المحفزات_والإجراءات", "#الشروط", "#رسم_خرائط_العمليات", "#تصميم_سير_العمل", "#تدفق_الأتمتة"],
    activities: [
      {
        id: "s2-drag",
        type: "dragdrop",
        title: "بناء تسلسل سير العمل",
        description: "اسحب وأفلت مكونات سير العمل بالترتيب الصحيح",
        items: [
          { id: "trigger", text: "المحفز: يقدم المريض طلب موعد", order: 1 },
          { id: "condition", text: "الشرط: التحقق من توفر الموعد المفضل", order: 2 },
          { id: "action1", text: "الإجراء: إرسال تأكيد أو خيارات بديلة", order: 3 },
          { id: "action2", text: "الإجراء: تحديث التقويم وسجل المريض", order: 4 },
          { id: "output", text: "المخرج: إشعار تأكيد للمريض", order: 5 }
        ]
      },
      {
        id: "s2-match",
        type: "match",
        title: "مكونات بناء سير العمل",
        description: "طابق كل مكون من مكونات سير العمل مع تعريفه",
        pairs: [
          { left: "يبدأ سير العمل تلقائيًا", right: "المحفز" },
          { left: "المهمة التي ينفذها النظام", right: "الإجراء" },
          { left: "يتحقق من استيفاء المعايير قبل المتابعة", right: "الشرط" },
          { left: "النتيجة النهائية المقدمة للمستخدم", right: "المخرج" },
          { left: "استلام نموذج جديد", right: "المحفز" },
          { left: "إرسال إشعار بالبريد الإلكتروني", right: "الإجراء" }
        ]
      }
    ]
  },
  {
    title: "وكلاء الذكاء الاصطناعي",
    shortDescription: "يقدم هذا القسم وكلاء الذكاء الاصطناعي كأنظمة يمكنها فهم الأهداف وتفسير المعلومات واتخاذ القرارات واتخاذ الإجراءات ضمن سير العمل. سيفهم المتعلمون كيف يختلف وكلاء الذكاء الاصطناعي عن الأتمتة العادية وأين يضيفون قيمة في العمليات الحقيقية.",
    outcomes: [
      "تعريف ماهية وكلاء الذكاء الاصطناعي",
      "شرح كيف يختلف وكلاء الذكاء الاصطناعي عن الأتمتة العادية",
      "تحديد أين يضيف وكلاء الذكاء الاصطناعي قيمة في سير العمل"
    ],
    tags: ["#وكلاء_الذكاء_الاصطناعي", "#قدرات_الوكلاء", "#دعم_القرار", "#الأنظمة_الموجهة_نحو_الهدف", "#سير_العمل_الذكي", "#الأتمتة_القائمة_على_الوكلاء"],
    activities: [
      {
        id: "s3-flash",
        type: "flashcard",
        title: "مفاهيم وكلاء الذكاء الاصطناعي",
        description: "مراجعة المفاهيم والقدرات الرئيسية لوكلاء الذكاء الاصطناعي",
        cards: [
          { front: "وكيل الذكاء الاصطناعي", back: "نظام يمكنه فهم الأهداف وتفسير السياق واتخاذ القرارات واتخاذ إجراءات مستقلة ضمن سير العمل." },
          { front: "السلوك الموجه نحو الهدف", back: "يعمل وكلاء الذكاء الاصطناعي نحو أهداف محددة بدلاً من مجرد اتباع قواعد ثابتة. يمكنهم تكييف نهجهم بناءً على السياق." },
          { front: "الوكيل مقابل الأتمتة العادية", back: "تتبع الأتمتة العادية خطوات ثابتة. يمكن لوكلاء الذكاء الاصطناعي التفسير والقرار والتكيف - التعامل مع الغموض والاستثناءات." },
          { front: "دعم القرار", back: "يمكن لوكلاء الذكاء الاصطناعي تحليل البيانات وتحديد الأنماط والتوصية بالإجراءات لدعم اتخاذ القرارات البشرية." },
          { front: "الاستدلال متعدد الخطوات", back: "يمكن لوكلاء الذكاء الاصطناعي تقسيم المهام المعقدة إلى مهام فرعية وتنفيذها بالتتابع والتعديل بناءً على النتائج الوسيطة." }
        ]
      },
      {
        id: "s3-match",
        type: "match",
        title: "مطابقة قدرات الوكلاء",
        description: "طابق كل قدرة مع الوصف الصحيح",
        pairs: [
          { left: "يقرأ ويفهم رسائل المرضى", right: "فهم اللغة الطبيعية" },
          { left: "يحدد أولويات المهام بناءً على الإلحاح", right: "اتخاذ القرار" },
          { left: "يعمل نحو هدف محدد", right: "السلوك الموجه نحو الهدف" },
          { left: "يعدل سير العمل بناءً على بيانات جديدة", right: "التنفيذ التكيفي" },
          { left: "يستدعي واجهات برمجة التطبيقات ويحدث السجلات", right: "استخدام الأدوات" },
          { left: "يتذكر التفاعلات السابقة", right: "الوعي بالسياق" }
        ]
      }
    ]
  },
  {
    title: "البرمجة بالوصف",
    shortDescription: "يقدم هذا القسم البرمجة بالوصف كطريقة جديدة لإنشاء الحلول الرقمية باستخدام الأوامر النصية بدلاً من البرمجة التقليدية. سيستكشف المتعلمون كيفية عمل إنشاء التطبيقات القائم على الأوامر ولماذا التكرار مهم وكيف تجعل البرمجة بالوصف النمذجة أسرع وأكثر سهولة.",
    outcomes: [
      "فهم ماهية البرمجة بالوصف",
      "شرح سير عمل التطوير القائم على الأوامر النصية",
      "إدراك فوائد النمذجة السريعة مع الذكاء الاصطناعي"
    ],
    tags: ["#البرمجة_بالوصف", "#التطوير_بالأوامر", "#النمذجة_السريعة", "#صف_ولّد_حسّن", "#الإنشاء_بمساعدة_الذكاء_الاصطناعي", "#بدون_كود"],
    activities: [
      {
        id: "s4-drag",
        type: "dragdrop",
        title: "سير عمل البرمجة بالوصف",
        description: "رتب خطوات البرمجة بالوصف بالترتيب الصحيح",
        items: [
          { id: "describe", text: "صف ما تريد بناءه بلغة طبيعية", order: 1 },
          { id: "generate", text: "يولد الذكاء الاصطناعي الكود/التطبيق الأولي", order: 2 },
          { id: "review", text: "راجع المخرجات المولدة", order: 3 },
          { id: "refine", text: "حسّن باستخدام أوامر متابعة", order: 4 },
          { id: "iterate", text: "كرر حتى يلبي الحل المتطلبات", order: 5 }
        ]
      },
      {
        id: "s4-flash",
        type: "flashcard",
        title: "المفاهيم الأساسية للبرمجة بالوصف",
        description: "مراجعة المفاهيم الأساسية للبرمجة بالوصف",
        cards: [
          { front: "البرمجة بالوصف", back: "إنشاء حلول رقمية عن طريق وصف ما تريده بلغة طبيعية، ثم ترك الذكاء الاصطناعي يولد الكود. لا تتطلب برمجة تقليدية." },
          { front: "صف ← ولّد ← حسّن", back: "حلقة البرمجة بالوصف الأساسية: صف فكرتك، يولد الذكاء الاصطناعي حلاً، تحسنه من خلال التكرار حتى يعمل كما تريد." },
          { front: "التطوير القائم على الأوامر", back: "كتابة تعليمات بلغة طبيعية (أوامر) لتوجيه الذكاء الاصطناعي في بناء التطبيقات، بدلاً من كتابة الكود يدويًا." },
          { front: "النمذجة السريعة", back: "إنشاء نماذج أولية عاملة بسرعة باستخدام أدوات الذكاء الاصطناعي، مما يتيح اختبار المفاهيم والتحقق منها بسرعة." },
          { front: "التكرار", back: "عملية تحسين الأوامر والمخرجات المولدة بشكل متكرر حتى يلبي الحل متطلباتك." }
        ]
      }
    ]
  },
  {
    title: "تصميم حلول أتمتة الذكاء الاصطناعي وحالات الاستخدام الشائعة",
    shortDescription: "يجمع هذا القسم المفاهيم من الأقسام السابقة ويوضح للمتعلمين كيفية تحديد فرص الأتمتة وتعريف سير العمل وإدراج الذكاء الاصطناعي حيث يضيف قيمة وتصميم مخرجات مفيدة. كما يستكشف حالات الاستخدام الشائعة مثل التنسيق التشغيلي والتواصل ودعم القرار والإنتاجية والمراقبة.",
    outcomes: [
      "تحديد فرص الأتمتة في سير العمل",
      "تصميم حلول أتمتة الذكاء الاصطناعي",
      "وصف حالات الاستخدام الشائعة عبر الفئات"
    ],
    tags: ["#تصميم_الحلول", "#فرص_الأتمتة", "#حالات_استخدام_الذكاء_الاصطناعي", "#تحسين_سير_العمل", "#دعم_القرار", "#المراقبة_والتنبيهات", "#الأتمتة_التشغيلية", "#أتمتة_الإنتاجية"],
    activities: [
      {
        id: "s5-match",
        type: "match",
        title: "فئات حالات الاستخدام",
        description: "طابق كل حالة استخدام مع فئتها",
        pairs: [
          { left: "جدولة المواعيد الآلية", right: "التنسيق التشغيلي" },
          { left: "تذكيرات متابعة المرضى", right: "التواصل" },
          { left: "تمييز نتائج المختبر غير الطبيعية", right: "دعم القرار" },
          { left: "إنشاء تقارير النوبات تلقائيًا", right: "الإنتاجية" },
          { left: "تتبع مستويات مخزون الأدوية", right: "المراقبة والتنبيهات" },
          { left: "توجيه الإحالات إلى المتخصصين", right: "التنسيق التشغيلي" }
        ]
      },
      {
        id: "s5-drag",
        type: "dragdrop",
        title: "خطوات تصميم الحل",
        description: "رتب عملية تصميم الحل بالترتيب الصحيح",
        items: [
          { id: "identify", text: "تحديد المشكلة والمهمة المتكررة", order: 1 },
          { id: "map", text: "رسم خريطة سير العمل الحالي", order: 2 },
          { id: "insert", text: "تحديد أين يضيف الذكاء الاصطناعي قيمة", order: 3 },
          { id: "design", text: "تصميم سير العمل الآلي", order: 4 },
          { id: "test", text: "اختبار الحل وتحسينه ونشره", order: 5 }
        ]
      }
    ]
  }
];

export const toolsAr = [
  {
    id: "lovable",
    tagline: "منصة البرمجة بالوصف — بناء التطبيقات باللغة الطبيعية",
    description: "Lovable هو منصة برمجة بالوصف تتيح للمستخدمين إنشاء تطبيقات من خلال وصف ما يريدونه باللغة الطبيعية. بدلاً من بناء الواجهة وكتابة الكود، تقدم أوامر نصية وتقوم المنصة بإنشاء التطبيق.",
    healthcareUseCase: "في هذا العرض، يريد طبيب تطبيقاً لتسجيل معلومات مرضى السكري وتخزين قراءات الجلوكوز واكتشاف القيم الخطرة ومراجعة سجلات المرضى بمرور الوقت. باستخدام ثلاثة أوامر يتم إنشاء التطبيق وتحسينه تدريجياً.",
    summaryPoints: [
      "صف فكرة تطبيقك بلغة طبيعية",
      "يولد الذكاء الاصطناعي تطبيق ويب كامل وعامل",
      "كرر وحسّن من خلال أوامر محادثة",
      "لا تتطلب خبرة في البرمجة",
      "مثالي للنمذجة السريعة لتطبيقات الرعاية الصحية"
    ],
    quiz: [
      { question: "ما هي طريقة الإدخال الأساسية لـ Lovable؟", options: ["كتابة الكود", "الأوامر النصية بلغة طبيعية", "السحب والإفلات", "القوالب المرئية"], correct: 1 },
      { question: "أي مما يلي هو حالة استخدام صحية لـ Lovable؟", options: ["إدارة قواعد البيانات", "إنشاء نموذج استقبال المرضى", "أمن الشبكات", "صيانة الأجهزة"], correct: 1 },
      { question: "ماذا يولد Lovable من أوامرك؟", options: ["التوثيق فقط", "تطبيق ويب عامل", "خطة مشروع", "حالات اختبار"], correct: 1 }
    ]
  },
  {
    id: "replit",
    tagline: "منصة التطوير بمساعدة الذكاء الاصطناعي",
    description: "Replit هي منصة تطوير بمساعدة الذكاء الاصطناعي تتيح إنشاء وتعديل وتشغيل واختبار التطبيقات في المتصفح. تجمع بين مساحة عمل البرمجة ودعم الذكاء الاصطناعي ومعاينة التطبيق والنمذة السريعة.",
    healthcareUseCase: "في هذا العرض، ننشئ مولد تقارير سريرية للطبيب. يقبل أعراض المريض ويولد ملخصاً سريرياً ويصنف مستوى الإلحاح ويسمح بالتصدير لأغراض التوثيق.",
    summaryPoints: [
      "بيئة تطوير سحابية",
      "مساعد ذكي يساعد في كتابة وتصحيح الكود",
      "بناء ونشر من متصفحك",
      "يدعم لغات برمجة متعددة",
      "رائع لتطوير أدوات الرعاية الصحية التعاونية"
    ],
    quiz: [
      { question: "ما نوع البيئة التي يوفرها Replit؟", options: ["بيئة تطوير سطح المكتب", "تطوير سحابي", "تطبيق جوال", "سطر الأوامر فقط"], correct: 1 },
      { question: "كيف يساعد ذكاء Replit الاصطناعي المطورين؟", options: ["يحل محل المطورين", "يساعد في كتابة وتصحيح الكود", "يجري الاختبارات فقط", "يدير الخوادم"], correct: 1 },
      { question: "ما هي الميزة الرئيسية لـ Replit لفرق الرعاية الصحية؟", options: ["فقط للخبراء", "يتطلب تثبيتًا محليًا", "يتيح التطوير التعاوني من المتصفح", "يعمل مع Python فقط"], correct: 2 }
    ]
  },
  {
    id: "claude-code",
    tagline: "سير عمل البرمجة بالأوامر",
    description: "Claude Code هو مساعد برمجة يتيح سير عمل التطوير القائم على الأوامر. يصف المستخدمون ما يريدون بناءه ويقوم Claude بإنشاء الكود وشرحه وتحسينه من خلال محادثة طبيعية.",
    healthcareUseCase: "إنشاء نظام تذكير بمواعيد المرضى من خلال وصف المنطق بشكل تحادثي. يكتب Claude Code منطق الجدولة وقوالب الإشعارات وكود التكامل مع شرح كل مكون.",
    summaryPoints: [
      "البرمجة التحادثية بلغة طبيعية",
      "يولد ويشرح ويحسن الكود",
      "يدعم المشاريع المعقدة متعددة الملفات",
      "يساعد غير المبرمجين في بناء حلول عاملة",
      "ممتاز لنصوص أتمتة سير العمل الصحي"
    ],
    quiz: [
      { question: "ما هي واجهة Claude Code الأساسية للبرمجة؟", options: ["السحب والإفلات المرئي", "المحادثة بلغة طبيعية", "اختيار القوالب", "البرمجة بالكتل"], correct: 1 },
      { question: "ماذا يمكن لـ Claude Code أن يفعل بخلاف إنشاء الكود؟", options: ["لا شيء آخر", "شرح وتحسين الكود", "إصلاح الأخطاء فقط", "كتابة التوثيق فقط"], correct: 1 },
      { question: "كيف يمكن لفرق الرعاية الصحية الاستفادة من Claude Code؟", options: ["استبدال جميع موظفي تكنولوجيا المعلومات", "بناء أتمتة سير العمل من خلال الأوامر", "لعلوم البيانات فقط", "لتصميم الويب فقط"], correct: 1 }
    ]
  },
  {
    id: "n8n",
    tagline: "أتمتة سير العمل",
    description: "n8n هي منصة أتمتة سير عمل مفتوحة المصدر تتيح للمستخدمين ربط التطبيقات والخدمات وواجهات برمجة التطبيقات من خلال واجهة مرئية قائمة على العقد. تدعم الأتمتة المعقدة متعددة الخطوات مع منطق شرطي.",
    healthcareUseCase: "أتمتة عملية إحالة المرضى: عند تقديم نموذج إحالة، يوجهه n8n إلى المتخصص المناسب، ويرسل تأكيدًا للمريض، ويحدث نظام السجلات الطبية، ويفعّل تذكيرات المتابعة.",
    summaryPoints: [
      "منشئ سير عمل مرئي قائم على العقد",
      "مفتوح المصدر وقابل للاستضافة الذاتية",
      "يربط مئات التطبيقات والخدمات",
      "يدعم المنطق الشرطي والتفرع",
      "مثالي لأتمتة سير العمل الصحي المعقد"
    ],
    quiz: [
      { question: "ما نوع الواجهة التي يستخدمها n8n؟", options: ["سطر الأوامر", "مرئية قائمة على العقد", "جدول بيانات", "لغة طبيعية فقط"], correct: 1 },
      { question: "ما هي الميزة الرئيسية لكون n8n مفتوح المصدر؟", options: ["أقل موثوقية", "يمكن استضافته ذاتيًا لخصوصية البيانات", "ميزات أقل", "لا يدعم التكاملات"], correct: 1 },
      { question: "أي عملية صحية يمكن لـ n8n أتمتتها؟", options: ["إجراءات الجراحة", "توجيه إحالات المرضى والإشعارات", "تمارين العلاج الطبيعي", "التصوير الطبي"], correct: 1 }
    ]
  },
  {
    id: "make",
    tagline: "الأتمتة والتنسيق متعدد الخطوات",
    description: "Make (المعروف سابقًا بـ Integromat) هو منصة أتمتة مرئية لإنشاء سير عمل متعدد الخطوات يربط التطبيقات والخدمات. يتميز بالسيناريوهات المعقدة مع مسارات متوازية ومعالجة الأخطاء وتحويل البيانات.",
    healthcareUseCase: "إنشاء سير عمل متعدد الخطوات لتهيئة المرضى: جمع معلومات المريض، التحقق من التأمين، جدولة الموعد الأولي، إرسال حزمة الترحيب، وإعداد الوصول إلى بوابة المريض — كل ذلك يتم تلقائيًا.",
    summaryPoints: [
      "منشئ سيناريوهات مرئي بالسحب والإفلات",
      "يدعم مسارات التنفيذ المتوازي",
      "تحويل بيانات متقدم وربط",
      "معالجة أخطاء مدمجة ومنطق إعادة المحاولة",
      "مثالي للتنسيق الصحي متعدد الخطوات"
    ],
    quiz: [
      { question: "ما كان يُعرف Make سابقًا؟", options: ["Zapier", "Integromat", "IFTTT", "Automate.io"], correct: 1 },
      { question: "في ماذا يتميز Make مقارنة بالأدوات الأبسط؟", options: ["المهام البسيطة", "السيناريوهات المعقدة متعددة الخطوات مع مسارات متوازية", "أتمتة البريد فقط", "إدارة قواعد البيانات"], correct: 1 },
      { question: "كيف يمكن لـ Make تحسين تهيئة المرضى؟", options: ["استبدال الأطباء", "أتمتة عمليات التحقق والإعداد متعددة الخطوات", "إنشاء سجلات طبية", "تشخيص الحالات"], correct: 1 }
    ]
  },
  {
    id: "zapier",
    tagline: "الأتمتة التشغيلية القائمة على المحفزات",
    description: "Zapier هي منصة أتمتة قائمة على المحفزات تربط آلاف التطبيقات باستخدام منطق إذا-حدث-هذا-افعل-ذاك البسيط. مصممة لسهولة الاستخدام وتسمح لأي شخص بإنشاء أتمتة تسمى 'Zaps' بدون برمجة.",
    healthcareUseCase: "أتمتة سير عمل التواصل مع المرضى: عند حجز موعد جديد في نظام الجدولة، يرسل Zapier تلقائيًا بريد تأكيد، ويضيف تذكيرًا في تقويم الفريق، ويحدث جدول تتبع المرضى.",
    summaryPoints: [
      "أتمتة بسيطة بالمحفز والإجراء (Zaps)",
      "يربط أكثر من 5,000 تطبيق وخدمة",
      "لا تتطلب برمجة",
      "سهل الإعداد والصيانة",
      "رائع للتواصل والتنسيق في الرعاية الصحية"
    ],
    quiz: [
      { question: "ماذا تسمى أتمتة Zapier؟", options: ["Flows", "Recipes", "Zaps", "Scripts"], correct: 2 },
      { question: "كم عدد التطبيقات التي يمكن لـ Zapier الاتصال بها؟", options: ["حوالي 50", "حوالي 500", "أكثر من 5,000", "10 فقط"], correct: 2 },
      { question: "ما هو نمط الأتمتة الأساسي لـ Zapier؟", options: ["قرارات مدفوعة بالذكاء الاصطناعي", "محفز-إجراء (إذا حدث هذا، افعل ذاك)", "سير عمل يدوي", "معالجة دفعية"], correct: 1 }
    ]
  }
];

/* ── Arabic Glossary ── */
export const glossaryAr = [
  { term: "الأتمتة", definition: "استخدام التكنولوجيا لأداء المهام بأقل تدخل بشري، مما يقلل الجهد اليدوي ويزيد الكفاءة.", module: "الوحدة 1" },
  { term: "الأتمتة التقليدية", definition: "أتمتة قائمة على القواعد تتبع منطقًا ثابتًا محددًا مسبقًا (إذا حدث X، افعل Y). تعمل بشكل جيد للمهام المنظمة والمتوقعة لكنها لا تستطيع التعامل مع الاستثناءات أو البيانات غير المنظمة.", module: "الوحدة 1" },
  { term: "أتمتة الذكاء الاصطناعي", definition: "أتمتة واعية للسياق تستخدم الذكاء الاصطناعي للتعامل مع البيانات غير المنظمة والتكيف مع المواقف الجديدة واتخاذ قرارات ذكية.", module: "الوحدة 1" },
  { term: "أتمتة المهام", definition: "أتمتة إجراء واحد منفصل مثل إرسال بريد إلكتروني أو إنشاء إدخال في التقويم أو حفظ البيانات في جدول بيانات.", module: "الوحدة 1" },
  { term: "أتمتة العمليات", definition: "ربط خطوات آلية متعددة في سير عمل موحد، مثل تدفق تهيئة الموارد البشرية أو خط معالجة الطلبات.", module: "الوحدة 1" },
  { term: "الأتمتة الذكية", definition: "تجمع بين الأتمتة وقدرات الذكاء الاصطناعي مثل التنبؤ والتصنيف والتوصية. تشمل الأمثلة تصنيف التذاكر واكتشاف الشذوذ.", module: "الوحدة 1" },
  { term: "سير العمل", definition: "تسلسل منظم من الخطوات يحدد كيفية تنفيذ مهمة أو عملية، يتضمن عادةً محفزات وإجراءات وشروط ومخرجات.", module: "الوحدة 2" },
  { term: "المحفز", definition: "الحدث أو الشرط الذي يبدأ سير العمل تلقائيًا، مثل تقديم نموذج أو بريد إلكتروني جديد أو وقت مجدول.", module: "الوحدة 2" },
  { term: "الإجراء", definition: "المهمة التي ينفذها النظام ضمن سير العمل، مثل إرسال إشعار أو تحديث سجل أو إنشاء تقرير.", module: "الوحدة 2" },
  { term: "الشرط", definition: "نقطة تحقق في سير العمل تقيّم ما إذا كانت معايير معينة مستوفاة قبل أن تستمر العملية في مسار محدد.", module: "الوحدة 2" },
  { term: "المخرج", definition: "النتيجة النهائية التي يقدمها سير العمل، مثل إشعار تأكيد أو تقرير مُنشأ أو إدخال محدث في قاعدة البيانات.", module: "الوحدة 2" },
  { term: "رسم خرائط العمليات", definition: "ممارسة التوثيق المرئي وتحليل خطوات العملية لتحديد مجالات التحسين أو الأتمتة.", module: "الوحدة 2" },
  { term: "وكيل الذكاء الاصطناعي", definition: "نظام يمكنه فهم الأهداف وتفسير السياق واتخاذ القرارات واتخاذ إجراءات مستقلة ضمن سير العمل، مع تكييف سلوكه بناءً على المعلومات الجديدة.", module: "الوحدة 3" },
  { term: "السلوك الموجه نحو الهدف", definition: "قدرة وكلاء الذكاء الاصطناعي على العمل نحو أهداف محددة بدلاً من اتباع قواعد ثابتة، مع تكييف نهجهم بناءً على السياق والنتائج الوسيطة.", module: "الوحدة 3" },
  { term: "فهم اللغة الطبيعية (NLU)", definition: "قدرة أنظمة الذكاء الاصطناعي على قراءة وتفسير واستخلاص المعنى من اللغة البشرية في شكل نصي أو كلامي.", module: "الوحدة 3" },
  { term: "الاستدلال متعدد الخطوات", definition: "قدرة وكلاء الذكاء الاصطناعي على تقسيم المهام المعقدة إلى مهام فرعية وتنفيذها بالتتابع والتعديل بناءً على النتائج الوسيطة.", module: "الوحدة 3" },
  { term: "الوعي بالسياق", definition: "قدرة وكلاء الذكاء الاصطناعي على تذكر التفاعلات السابقة واستخدام تلك المعلومات لاتخاذ قرارات أفضل في المهام الحالية.", module: "الوحدة 3" },
  { term: "دعم القرار", definition: "تحليل البيانات المدعوم بالذكاء الاصطناعي وتحديد الأنماط والتوصية بالإجراءات لمساعدة البشر على اتخاذ قرارات أفضل وأسرع.", module: "الوحدة 3" },
  { term: "البرمجة بالوصف", definition: "إنشاء حلول رقمية عن طريق وصف ما تريده بلغة طبيعية، ثم ترك الذكاء الاصطناعي يولد الكود. لا تتطلب خبرة برمجة تقليدية.", module: "الوحدة 4" },
  { term: "التطوير القائم على الأوامر", definition: "كتابة تعليمات بلغة طبيعية (أوامر) لتوجيه الذكاء الاصطناعي في بناء التطبيقات، بدلاً من كتابة الكود يدويًا سطرًا بسطر.", module: "الوحدة 4" },
  { term: "صف-ولّد-حسّن", definition: "حلقة البرمجة بالوصف الأساسية: صف فكرتك بلغة طبيعية، يولد الذكاء الاصطناعي حلاً، تحسنه من خلال أوامر تكرارية حتى يعمل كما تريد.", module: "الوحدة 4" },
  { term: "النمذجة السريعة", definition: "إنشاء نماذج أولية عاملة بسرعة باستخدام أدوات الذكاء الاصطناعي، مما يتيح اختبار المفاهيم والتحقق منها بسرعة قبل التنفيذ الكامل.", module: "الوحدة 4" },
  { term: "التكرار", definition: "عملية تحسين الأوامر والمخرجات المولدة بشكل متكرر حتى يلبي الحل المتطلبات بالكامل.", module: "الوحدة 4" },
  { term: "فرصة الأتمتة", definition: "مهمة أو عملية متكررة أو مستهلكة للوقت أو عرضة للأخطاء أو قائمة على القواعد، مما يجعلها مرشحًا جيدًا للأتمتة.", module: "الوحدة 5" },
  { term: "تصميم الحل", definition: "عملية تحديد المشكلة ورسم سير العمل الحالي وإدراج الذكاء الاصطناعي حيث يضيف قيمة وتصميم سير العمل الآلي واختبار الحل.", module: "الوحدة 5" },
  { term: "التنسيق التشغيلي", definition: "حالات استخدام الأتمتة المتعلقة بالجدولة والتوجيه وتخصيص الموارد والتنسيق بين الأقسام.", module: "الوحدة 5" },
  { term: "أتمتة التواصل", definition: "سير عمل آلي لإرسال التذكيرات والمتابعات والإشعارات واتصالات المرضى بدون تدخل يدوي.", module: "الوحدة 5" },
  { term: "المراقبة والتنبيهات", definition: "أنظمة آلية تتتبع المقاييس الرئيسية وتكتشف الشذوذ وترسل تنبيهات عند تجاوز الحدود، مثل تتبع المخزون أو مراقبة العلامات الحيوية.", module: "الوحدة 5" },
  { term: "Lovable", definition: "منشئ تطبيقات قائم على الأوامر النصية يسمح للمستخدمين بوصف ما يريدون والحصول على تطبيق ويب عامل بدون برمجة تقليدية.", module: "الأدوات" },
  { term: "Replit", definition: "بيئة تطوير سحابية مع إمكانيات ترميز بمساعدة الذكاء الاصطناعي، تتيح للمستخدمين بناء واختبار ونشر التطبيقات بالكامل في المتصفح.", module: "الأدوات" },
  { term: "Claude Code", definition: "مساعد برمجة بالذكاء الاصطناعي يتيح سير عمل التطوير القائم على الأوامر، ينشئ ويشرح ويحسن الكود من خلال محادثة طبيعية.", module: "الأدوات" },
  { term: "n8n", definition: "منصة أتمتة سير عمل مفتوحة المصدر بواجهة مرئية قائمة على العقد تربط التطبيقات والخدمات وواجهات برمجة التطبيقات من خلال أتمتة معقدة متعددة الخطوات.", module: "الأدوات" },
  { term: "Make (Integromat)", definition: "منصة أتمتة مرئية لإنشاء سير عمل متعدد الخطوات مع مسارات متوازية ومعالجة الأخطاء وتحويل البيانات عبر التطبيقات والخدمات المتصلة.", module: "الأدوات" },
  { term: "Zapier", definition: "منصة أتمتة قائمة على المحفزات تربط آلاف التطبيقات باستخدام منطق إذا-حدث-هذا-افعل-ذاك البسيط، وتنشئ أتمتة تسمى 'Zaps' بدون برمجة.", module: "الأدوات" },
  { term: "Zap", definition: "سير عمل آلي واحد في Zapier، يتكون من حدث محفز وإجراء واحد أو أكثر يتم تنفيذه عند تفعيل المحفز.", module: "الأدوات" },
  { term: "واجهة برمجة التطبيقات (API)", definition: "مجموعة من القواعد والبروتوكولات التي تسمح لتطبيقات البرامج المختلفة بالتواصل مع بعضها البعض، مما يتيح تبادل البيانات والتكامل.", module: "عام" },
  { term: "منخفض الكود / بدون كود", definition: "أساليب تطوير تتطلب الحد الأدنى أو لا تتطلب برمجة تقليدية، باستخدام واجهات مرئية ومكونات السحب والإفلات أو اللغة الطبيعية لإنشاء التطبيقات.", module: "عام" },
  { term: "أتمتة إنتاجية الرعاية الصحية", definition: "تطبيق تقنيات الأتمتة خصيصًا على سير عمل الرعاية الصحية، لتقليل العبء الإداري وتحسين الكفاءة التشغيلية.", module: "عام" }
];

/* ── Arabic module colors for glossary ── */
export const moduleColorsAr = {
  "الوحدة 1": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-100" },
  "الوحدة 2": { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-100" },
  "الوحدة 3": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100" },
  "الوحدة 4": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-100" },
  "الوحدة 5": { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-100" },
  "الأدوات": { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-100" },
  "عام": { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200" }
};

export const moduleOrderAr = ["الوحدة 1", "الوحدة 2", "الوحدة 3", "الوحدة 4", "الوحدة 5", "الأدوات", "عام"];

/* ── Course Glossary / Dictionary ── */
export const glossary = [
  { term: "Automation", definition: "Using technology to perform tasks with minimal human intervention, reducing manual effort and increasing efficiency.", module: "Module 1" },
  { term: "Traditional Automation", definition: "Rule-based automation that follows fixed, predefined logic (If X, do Y). Works well for structured, predictable tasks but cannot handle exceptions or unstructured data.", module: "Module 1" },
  { term: "AI Automation", definition: "Context-aware automation that uses artificial intelligence to handle unstructured data, adapt to new situations, and make intelligent decisions.", module: "Module 1" },
  { term: "Task Automation", definition: "Automating a single, isolated action such as sending an email, creating a calendar entry, or saving data to a spreadsheet.", module: "Module 1" },
  { term: "Process Automation", definition: "Connecting multiple automated steps into a unified workflow, such as an HR onboarding flow or order processing pipeline.", module: "Module 1" },
  { term: "Intelligent Automation", definition: "Combines automation with AI capabilities like predicting, classifying, and recommending. Examples include ticket classification and anomaly detection.", module: "Module 1" },
  { term: "Workflow", definition: "A structured sequence of steps that define how a task or process is executed, typically involving triggers, actions, conditions, and outputs.", module: "Module 2" },
  { term: "Trigger", definition: "The event or condition that starts a workflow automatically, such as a form submission, a new email, or a scheduled time.", module: "Module 2" },
  { term: "Action", definition: "The task performed by the system within a workflow, such as sending a notification, updating a record, or generating a report.", module: "Module 2" },
  { term: "Condition", definition: "A checkpoint in a workflow that evaluates whether certain criteria are met before the process continues along a specific path.", module: "Module 2" },
  { term: "Output", definition: "The final result delivered by a workflow, such as a confirmation notification, a generated report, or an updated database entry.", module: "Module 2" },
  { term: "Process Mapping", definition: "The practice of visually documenting and analyzing the steps in a process to identify areas for improvement or automation.", module: "Module 2" },
  { term: "AI Agent", definition: "A system that can understand goals, interpret context, make decisions, and take autonomous actions within a workflow, adapting its behavior based on new information.", module: "Module 3" },
  { term: "Goal-Oriented Behavior", definition: "The ability of AI agents to work toward defined objectives rather than following fixed rules, adapting their approach based on context and intermediate results.", module: "Module 3" },
  { term: "Natural Language Understanding (NLU)", definition: "The capability of AI systems to read, interpret, and derive meaning from human language in text or speech form.", module: "Module 3" },
  { term: "Multi-Step Reasoning", definition: "The ability of AI agents to break complex tasks into sub-tasks, execute them sequentially, and adjust based on intermediate results.", module: "Module 3" },
  { term: "Context Awareness", definition: "The ability of AI agents to remember previous interactions and use that information to make better decisions in current tasks.", module: "Module 3" },
  { term: "Decision Support", definition: "AI-powered analysis of data, identification of patterns, and recommendation of actions to help humans make better, faster decisions.", module: "Module 3" },
  { term: "Vibe Coding", definition: "Creating digital solutions by describing what you want in natural language, then letting AI generate the code. No traditional programming experience is required.", module: "Module 4" },
  { term: "Prompt-Driven Development", definition: "Writing natural language instructions (prompts) to guide AI in building applications, instead of writing code manually line by line.", module: "Module 4" },
  { term: "Describe-Generate-Refine", definition: "The core vibe coding loop: describe your idea in natural language, AI generates a solution, you refine through iterative prompts until it works as needed.", module: "Module 4" },
  { term: "Rapid Prototyping", definition: "Quickly creating working prototypes of ideas using AI tools, enabling fast testing and validation of concepts before full implementation.", module: "Module 4" },
  { term: "Iteration", definition: "The process of repeatedly refining prompts and generated output until the solution fully meets requirements.", module: "Module 4" },
  { term: "Automation Opportunity", definition: "A task or process that is repetitive, time-consuming, error-prone, or rule-based, making it a good candidate for automation.", module: "Module 5" },
  { term: "Solution Design", definition: "The process of identifying a problem, mapping the current workflow, inserting AI where it adds value, designing the automated workflow, and testing the solution.", module: "Module 5" },
  { term: "Operational Coordination", definition: "Automation use cases related to scheduling, routing, resource allocation, and cross-department coordination.", module: "Module 5" },
  { term: "Communication Automation", definition: "Automated workflows for sending reminders, follow-ups, notifications, and patient communications without manual intervention.", module: "Module 5" },
  { term: "Monitoring & Alerts", definition: "Automated systems that track key metrics, detect anomalies, and send alerts when thresholds are breached, such as inventory tracking or vital sign monitoring.", module: "Module 5" },
  { term: "Lovable", definition: "A prompt-based application builder that allows users to describe what they want and get a working web application without traditional coding.", module: "Tools" },
  { term: "Replit", definition: "A cloud-based development environment with AI-assisted coding capabilities, allowing users to build, test, and deploy applications entirely in the browser.", module: "Tools" },
  { term: "Claude Code", definition: "An AI coding assistant that enables prompt-driven development workflows, generating, explaining, and refining code through natural conversation.", module: "Tools" },
  { term: "n8n", definition: "An open-source workflow automation platform with a visual node-based interface that connects apps, services, and APIs through complex multi-step automations.", module: "Tools" },
  { term: "Make (Integromat)", definition: "A visual automation platform for creating multi-step workflows with parallel paths, error handling, and data transformation across connected apps and services.", module: "Tools" },
  { term: "Zapier", definition: "A trigger-based automation platform that connects thousands of apps using simple if-this-then-that logic, creating automations called 'Zaps' without coding.", module: "Tools" },
  { term: "Zap", definition: "A single automated workflow in Zapier, consisting of a trigger event and one or more actions that execute when the trigger fires.", module: "Tools" },
  { term: "API (Application Programming Interface)", definition: "A set of rules and protocols that allows different software applications to communicate with each other, enabling data exchange and integration.", module: "General" },
  { term: "Low-Code / No-Code", definition: "Development approaches that require minimal or no traditional programming, using visual interfaces, drag-and-drop components, or natural language to create applications.", module: "General" },
  { term: "Healthcare Productivity Automation", definition: "The application of automation technologies specifically to healthcare workflows, reducing administrative burden and improving operational efficiency.", module: "General" }
];
