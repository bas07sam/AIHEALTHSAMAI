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
    totalSlides: 11,
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
    ]
  },
  {
    id: "section-2",
    number: 2,
    title: "Workflow Thinking",
    shortDescription: "This section explains how work is organized into workflows and why workflow thinking is essential for automation design. Learners will explore workflow building blocks such as triggers, actions, conditions, and outputs, and learn how to break a process into structured steps.",
    tags: ["#WorkflowThinking", "#TriggersAndActions", "#Conditions", "#ProcessMapping", "#WorkflowDesign", "#AutomationFlow"],
    pdfUrl: "/module2.pdf",
    totalSlides: 9,
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
    ]
  },
  {
    id: "section-3",
    number: 3,
    title: "AI Agents",
    shortDescription: "This section introduces AI agents as systems that can understand goals, interpret information, make decisions, and take actions within workflows. Learners will understand how AI agents differ from standard automation and where they add value in real processes.",
    tags: ["#AIAgents", "#AgentCapabilities", "#DecisionSupport", "#GoalOrientedSystems", "#IntelligentWorkflows", "#AgentBasedAutomation"],
    pdfUrl: "/module3.pdf",
    totalSlides: 12,
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
    ]
  },
  {
    id: "section-4",
    number: 4,
    title: "Vibe Coding",
    shortDescription: "This section introduces vibe coding as a new way of creating digital solutions using natural language prompts instead of traditional programming. Learners will explore how prompt-driven app creation works, why iteration matters, and how vibe coding makes prototyping faster and more accessible.",
    tags: ["#VibeCoding", "#PromptDrivenDevelopment", "#RapidPrototyping", "#DescribeGenerateRefine", "#AIAssistedCreation", "#NoCodeLowCodeThinking"],
    pdfUrl: "/module4.pdf",
    totalSlides: 10,
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
    ]
  },
  {
    id: "section-5",
    number: 5,
    title: "Designing AI Automation Solutions & Common Use Cases",
    shortDescription: "This section brings together the concepts from earlier sections and shows learners how to identify automation opportunities, define workflows, insert AI where it adds value, and design useful outputs. It also explores common automation use cases such as operational coordination, communication, decision support, productivity, and monitoring.",
    tags: ["#SolutionDesign", "#AutomationOpportunities", "#AIUseCases", "#WorkflowOptimization", "#DecisionSupport", "#MonitoringAndAlerts", "#OperationalAutomation", "#ProductivityAutomation"],
    pdfUrl: "/module5.pdf",
    totalSlides: 10,
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
    ]
  }
];

export const tools = [
  {
    id: "lovable",
    name: "Lovable",
    tagline: "Prompt-based app creation",
    description: "Lovable is a prompt-based application builder that allows users to describe what they want and get a working web application. It enables rapid prototyping without traditional coding skills.",
    healthcareUseCase: "Create a patient intake form application by describing the requirements in natural language. Lovable generates a functional web app with form validation, data collection, and a clean interface — ready for testing in minutes.",
    videoUrl: "https://www.youtube.com/embed/yMeHhoqnMbM",
    summaryPoints: [
      "Describe your app idea in natural language",
      "AI generates a complete, functional web application",
      "Iterate and refine through conversational prompts",
      "No coding experience required",
      "Ideal for rapid healthcare app prototyping"
    ],
    quiz: [
      { question: "What is the primary input method for Lovable?", options: ["Writing code", "Natural language prompts", "Drag and drop", "Visual templates"], correct: 1 },
      { question: "Which of the following is a healthcare use case for Lovable?", options: ["Database administration", "Patient intake form creation", "Network security", "Hardware maintenance"], correct: 1 },
      { question: "What does Lovable generate from your prompts?", options: ["Documentation only", "A working web application", "A project plan", "Test cases"], correct: 1 }
    ]
  },
  {
    id: "replit",
    name: "Replit",
    tagline: "AI-assisted development",
    description: "Replit is a cloud-based development environment with AI-assisted coding capabilities. It allows users to build, test, and deploy applications entirely in the browser with AI helping write and debug code.",
    healthcareUseCase: "Build a healthcare dashboard that displays patient appointment statistics, wait times, and resource allocation. Use Replit's AI assistant to help generate the code, debug issues, and deploy the solution — all from your browser.",
    videoUrl: "https://www.youtube.com/embed/t2AcMs3wbh0",
    summaryPoints: [
      "Cloud-based development environment",
      "AI assistant helps write and debug code",
      "Build and deploy from your browser",
      "Supports multiple programming languages",
      "Great for collaborative healthcare tool development"
    ],
    quiz: [
      { question: "What type of environment does Replit provide?", options: ["Desktop IDE", "Cloud-based development", "Mobile app", "Command line only"], correct: 1 },
      { question: "How does Replit's AI assist developers?", options: ["It replaces developers", "It helps write and debug code", "It only runs tests", "It manages servers"], correct: 1 },
      { question: "What is a key advantage of Replit for healthcare teams?", options: ["It's only for experts", "It requires local installation", "It enables browser-based collaborative development", "It only works with Python"], correct: 2 }
    ]
  },
  {
    id: "claude-code",
    name: "Claude Code",
    tagline: "Prompt-driven coding workflow",
    description: "Claude Code is a coding assistant that enables prompt-driven development workflows. Users describe what they want to build and Claude generates, explains, and refines code through natural conversation.",
    healthcareUseCase: "Generate a patient appointment reminder system by describing the logic conversationally. Claude Code writes the scheduling logic, notification templates, and integration code while explaining each component.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    summaryPoints: [
      "Conversational coding through natural language",
      "Generates, explains, and refines code",
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
    tagline: "Workflow automation",
    description: "n8n is an open-source workflow automation platform that allows users to connect apps, services, and APIs through a visual node-based interface. It supports complex multi-step automations with conditional logic.",
    healthcareUseCase: "Automate the patient referral process: when a referral form is submitted, n8n routes it to the appropriate specialist, sends confirmation to the patient, updates the medical record system, and triggers follow-up reminders.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
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
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
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
    description: "Zapier is a trigger-based automation platform that connects thousands of apps using simple if-this-then-that logic. It's designed for ease of use and allows anyone to create automations called 'Zaps' without coding.",
    healthcareUseCase: "Automate patient communication workflows: when a new appointment is booked in the scheduling system, Zapier automatically sends a confirmation email, adds a reminder to the team calendar, and updates the patient tracking spreadsheet.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
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
