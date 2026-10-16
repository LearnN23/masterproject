/**
 * TECHQUEST: Master Audio Loop Task Data (Lessons 1 to 8)
 * Grounded in Task-Based Language Teaching (TBLT) and Contact Center QA Standards
 * Extracted directly from official 'loop task/Lesson 1-8 Loop task.docx' curriculum files
 */

export const LOOP_TASKS_DATA = {
  1: {
    id: 1,
    unitId: "lesson_1",
    title: "Lesson 1: Professional Customer Enquiries & Opening a Support Interaction",
    shortTitle: "Customer Enquiries & Call Openings",
    workplace: "Concentrix IT Service Desk (Malaysia)",
    callerName: "Sarah (Marketing Department)",
    scenario: "Sarah from Marketing is in a rush because she cannot log into the company portal and has an urgent client report due in 10 minutes.",
    durationTotalMinutes: 120,
    preTask: {
      usefulExpressions: [
        {
          category: "Brand Greeting & Agent Identification",
          examples: [
            "Thank you for calling Concentrix IT Support. My name is [Agent Name].",
            "Good morning, IT Service Desk. This is [Agent Name] speaking.",
            "Thank you for contacting Technical Support. My name is [Agent Name]. How may I assist you today?"
          ]
        },
        {
          category: "Empathy & Immediate Reassurance",
          examples: [
            "I understand how urgent this is for your presentation. Don't worry, I can help you with that right away.",
            "I completely understand how frustrating it is to be locked out when you have a deadline. Let's get this sorted out.",
            "I would be glad to look into this login issue for you today."
          ]
        },
        {
          category: "Probing & Identity Verification",
          examples: [
            "To access your account securely, may I please verify your full name and Employee ID?",
            "Could you kindly confirm the registered email address linked to your portal profile?",
            "Could you please tell me the exact error message that appears on your screen?"
          ]
        },
        {
          category: "Sequencing Instructions & Courtesy Hold",
          examples: [
            "Please allow me just a moment while I pull up your account record in our system.",
            "First, I have unlocked your profile from our dashboard.",
            "Next, could you please verify that your Caps Lock is turned off and try signing in again?",
            "Finally, if the error persists, I will send a temporary password reset link directly to your mobile."
          ]
        }
      ],
      vocabulary: [
        { customerPhrase: "I'm locked out", technicalTerm: "Account Lockout", meaning: "User account automatically locked due to exceeding maximum failed authentication attempts." },
        { customerPhrase: "It won't let me sign in", technicalTerm: "Authentication Failure", meaning: "System rejects credentials due to mismatched password or expired session token." },
        { customerPhrase: "The screen is throwing red text", technicalTerm: "Invalid Credentials Error", meaning: "System warning indicating incorrect username or password." },
        { customerPhrase: "Company portal", technicalTerm: "Enterprise Application Dashboard", meaning: "Core web-based business management interface." }
      ],
      grammarFocus: {
        title: "Polite Modal Requests (May I... / Could you...)",
        syntax: "[Modal: May / Could] + [Subject: I / you] + [Polite: please/kindly] + [Base Verb] + [Target Info]?",
        bad: "Give me your password and ID right now.",
        good: "May I please have your Employee ID and workstation name?"
      }
    },
    turns: [
      {
        turnNumber: 1,
        speaker: "Customer (Sarah)",
        role: "caller",
        isStudent: false,
        audioPrompt: "Hi, IT Service Desk? This is Sarah from Marketing. I can't log into the company portal at all! The screen keeps throwing an error, and I have an urgent client report due in 10 minutes. Please help!",
        tone: "Rushed, stressed, and anxious",
        timeLimit: 20
      },
      {
        turnNumber: 2,
        speaker: "Student Agent",
        role: "agent",
        isStudent: true,
        timeLimit: 30,
        taskGoal: "Deliver standard brand greeting, introduce your name, show empathy/reassurance, and use a polite modal verb to request Employee ID and workstation name.",
        hints: [
          "Greeting: 'Good morning, Concentrix IT Service Desk. My name is [Your Name].'",
          "Empathy: 'I completely understand this is urgent, Sarah, and I will be glad to assist you right away.'",
          "Modal Request: 'To access your profile, may I please verify your Employee ID and workstation name?'"
        ],
        modelResponse: "Good morning, Concentrix IT Service Desk. My name is Golf. I completely understand this is urgent, Sarah, and I will be glad to assist you with logging in right away. To access your profile, may I please verify your Employee ID and workstation name?",
        modelAnalysis: "Complete brand greeting, immediate empathy to reduce stress, and polite modal request complying with security protocols."
      },
      {
        turnNumber: 3,
        speaker: "Customer (Sarah)",
        role: "caller",
        isStudent: false,
        audioPrompt: "Thanks for checking. My Employee ID is MK-4092, on laptop DESKTOP-MKT04. The exact red text on the screen says 'Invalid Credentials or Account Locked', but I'm completely sure I typed my password correctly!",
        tone: "Slightly relieved after being acknowledged, but still worried about credentials",
        timeLimit: 25
      },
      {
        turnNumber: 4,
        speaker: "Student Agent",
        role: "agent",
        isStudent: true,
        timeLimit: 35,
        taskGoal: "Use courtesy hold phrasing while checking system, explain sequential instructions (account unlock, check Caps Lock, password reset offer), and offer closing assistance.",
        hints: [
          "Courtesy Hold: 'Thank you for confirming those details, Sarah. Please allow me just a moment while I pull up your account record.'",
          "Sequencing: 'First, I have just unlocked your account on our server. Next, could you please make sure your Caps Lock key is off, and try logging in again?'",
          "Alternative/Closing: 'If needed, I can also trigger an immediate password reset to your mobile.'"
        ],
        modelResponse: "Thank you for confirming those details, Sarah. Please allow me just a moment while I pull up your account record. First, I have just unlocked your account on our server. Next, could you please make sure your Caps Lock key is off, and try logging in again? If needed, I can also trigger an immediate password reset to your mobile.",
        modelAnalysis: "Courtesy hold phrasing prevents dead air, and transition markers (First, Next) provide clear, panic-free troubleshooting."
      }
    ],
    postTask: {
      modelDialogue: [
        { turn: 1, speaker: "Customer (Sarah)", text: "Hi, IT Service Desk? This is Sarah from Marketing. I can't log into the company portal at all! The screen keeps throwing an error, and I have an urgent client report due in 10 minutes. Please help!", purpose: "Customer expressing urgency and distress" },
        { turn: 2, speaker: "Agent (Golf)", text: "Good morning, Concentrix IT Service Desk. My name is Golf. I completely understand this is urgent, Sarah, and I will be glad to assist you with logging in right away. To access your profile, may I please verify your Employee ID and workstation name?", purpose: "Brand Salutation + Empathy + Modal Verification" },
        { turn: 3, speaker: "Customer (Sarah)", text: "Thanks for checking. My Employee ID is MK-4092, on laptop DESKTOP-MKT04. The exact red text on the screen says 'Invalid Credentials or Account Locked', but I'm completely sure I typed my password correctly!", purpose: "Customer provides credentials and diagnostic error" },
        { turn: 4, speaker: "Agent (Golf)", text: "Thank you for confirming those details, Sarah. Please allow me just a moment while I pull up your account record. First, I have just unlocked your account on our server. Next, could you please make sure your Caps Lock key is off, and try logging in again? If needed, I can also trigger an immediate password reset to your mobile.", purpose: "Courtesy Hold + Sequential Instructions + Resolution Offer" }
      ],
      languageFunctions: [
        { phrasing: "Good morning, Concentrix IT Service Desk. My name is Golf.", function: "Brand Salutation & Agent Identification", rationale: "Builds corporate credibility and meets QA BPO compliance standards." },
        { phrasing: "I completely understand this is urgent, Sarah, and I will be glad to assist you right away.", function: "Empathy & Immediate Reassurance", rationale: "De-escalates customer anxiety and boosts CSAT satisfaction ratings." },
        { phrasing: "May I please verify your Employee ID and workstation name?", function: "Polite Credential Verification (Modal Request)", rationale: "Complies with Data Privacy protocols without sounding demanding or accusatory." },
        { phrasing: "Please allow me just a moment while I pull up your account...", function: "Courtesy Hold Phrasing", rationale: "Prevents 'Dead Air' silence on the call and reassures caller action is ongoing." },
        { phrasing: "First, I have unlocked... Next, could you please...?", function: "Sequencing Instructions", rationale: "Reduces cognitive load so user follows steps smoothly without confusion." }
      ],
      alternativeResponses: [
        {
          style: "Direct & Action-Oriented (Urgent Rush)",
          turn2: "IT Helpdesk, this is Golf. I understand you are in a rush—let's resolve this login issue immediately. Could you kindly provide your staff ID so that I can look into your portal credentials?",
          turn4: "I've refreshed your permissions in the system. Would you mind closing the browser and giving it another try?"
        },
        {
          style: "Standard Professional (Corporate Standard)",
          turn2: "Thank you for calling IT Support. My name is Golf. Don't worry at all, Sarah, I can certainly help get your portal working before your deadline. May I verify your user account ID?",
          turn4: "Your profile has been unlocked. Could you please attempt to log in now while I stay on the line with you?"
        }
      ],
      selfAssessmentChecklist: [
        "I stated a professional brand greeting and introduced my name clearly in Turn 2.",
        "I expressed genuine empathy and validated the caller's deadline urgency.",
        "I used a polite modal verb (May I... / Could you...) to request ID and workstation details.",
        "I used a courtesy hold phrase to avoid dead air before checking records.",
        "I explained sequential troubleshooting steps using transition markers (First, Next) in Turn 4."
      ]
    },
    // Backwards compatibility aliases
    audioPrompt: "Hi, IT Service Desk? This is Sarah from Marketing. I can't log into the company portal at all! The screen keeps throwing an error, and I have an urgent client report due in 10 minutes. Please help!",
    taskGoal: "Deliver standard brand greeting, introduce your name, show empathy/reassurance, and use a polite modal verb to request Employee ID and workstation name.",
    timeLimit: 30,
    checklist: [
      "I stated a professional brand greeting and introduced my name clearly.",
      "I expressed genuine empathy and validated the caller's deadline urgency.",
      "I used a polite modal verb (May I... / Could you...) to request ID and workstation details."
    ],
    hints: [
      "Greeting: 'Good morning, Concentrix IT Service Desk. My name is [Your Name].'",
      "Empathy: 'I completely understand this is urgent, Sarah, and I will be glad to assist you right away.'",
      "Modal Request: 'To access your profile, may I please verify your Employee ID and workstation name?'"
    ],
    modelResponse: "Good morning, Concentrix IT Service Desk. My name is Golf. I completely understand this is urgent, Sarah, and I will be glad to assist you with logging in right away. To access your profile, may I please verify your Employee ID and workstation name?"
  },

  2: {
    id: 2,
    unitId: "lesson_2",
    title: "Lesson 2: Identifying and Clarifying Technical Problems",
    shortTitle: "Clarifying Technical Problems",
    workplace: "Technical Support Helpdesk (Level-1 IT Support / BPO Center)",
    callerName: "Corporate User (Enterprise Portal)",
    scenario: "A corporate user is trying to submit an urgent report within 20 minutes, but the company portal is completely broken with a vague error.",
    durationTotalMinutes: 150,
    preTask: {
      usefulExpressions: [
        {
          category: "Empathetic Acknowledgment",
          examples: [
            "I understand how critical this submission is for you, and I can certainly help you resolve this right away.",
            "I hear how frustrating it is when the portal is unresponsive right before a deadline.",
            "Don't worry, let's work through this together to get your access restored."
          ]
        },
        {
          category: "Indirect Diagnostic Probing Questions",
          examples: [
            "Could you please tell me what error message or numeric code appears on your screen?",
            "Would you mind specifying whether you are connected via office Wi-Fi or home network?",
            "Could you explain what happens right after you enter your credentials?"
          ]
        },
        {
          category: "Reflective Paraphrasing",
          examples: [
            "So if I understand correctly, your credentials are accepted, but the connection times out with Error 504.",
            "Just to confirm, you are seeing a 504 Gateway error while connected to your home Wi-Fi, is that correct?",
            "In other words, the screen freezes only after clicking the submit button."
          ]
        }
      ],
      vocabulary: [
        { customerPhrase: "It's completely broken", technicalTerm: "Application Freeze / Unresponsive State", meaning: "Application fails to execute user request or process session data." },
        { customerPhrase: "Weird error", technicalTerm: "HTTP 504 Gateway Timeout", meaning: "Edge server did not receive timely response from upstream application server." },
        { customerPhrase: "Spinning wheel / loading forever", technicalTerm: "Latency / Network Timeout", meaning: "Connection packets dropped or delayed before handshake completion." },
        { customerPhrase: "Home Wi-Fi", technicalTerm: "Unsecured / Non-Corporate Network", meaning: "Requires enterprise VPN tunnel to reach protected internal endpoints." }
      ],
      grammarFocus: {
        title: "Indirect Questions Syntax (Could you tell me...)",
        syntax: "Lead-in phrase (Could you tell me / Would you mind specifying) + Wh-word / if / whether + Subject + Verb [Statement Order]",
        bad: "Could you tell me what is the error code? (Inversion error)",
        good: "Could you tell me what the error code is? (Correct statement word order)"
      }
    },
    turns: [
      {
        turnNumber: 1,
        speaker: "Customer",
        role: "caller",
        isStudent: false,
        audioPrompt: "Hi, helpdesk? Look, I'm trying to log into the company portal to submit my urgent report, but it's completely broken! The screen just gave me some weird error and won't let me in. I really need to send this within the next twenty minutes!",
        tone: "Frustrated, urgent, vague customer language",
        timeLimit: 20
      },
      {
        turnNumber: 2,
        speaker: "Student Agent",
        role: "agent",
        isStudent: true,
        timeLimit: 30,
        taskGoal: "Calmly acknowledge the caller's urgency with empathy, and use an indirect diagnostic question to ask for the exact error code or message.",
        hints: [
          "Empathy: 'I understand how critical this submission is for you, and I can certainly help you resolve this right away.'",
          "Indirect Question: 'To diagnose the problem, could you please tell me what exact error message or code appears on your screen?'"
        ],
        modelResponse: "I understand how critical this submission is for you, and I can certainly help you resolve this right away. To diagnose the problem, could you please read me the exact error message or code displayed on your screen?",
        modelAnalysis: "Maintains calm professional composure, avoids dismissiveness, and uses statement word order after indirect lead-in."
      },
      {
        turnNumber: 3,
        speaker: "Customer",
        role: "caller",
        isStudent: false,
        audioPrompt: "Let me check... Okay, a pop-up says 'Authentication Timeout - Error 504 Gateway'. But I'm sure I typed my password correctly, and my laptop is connected to my home Wi-Fi.",
        tone: "Calmer after being validated, provides technical clues (Error 504, home Wi-Fi)",
        timeLimit: 25
      },
      {
        turnNumber: 4,
        speaker: "Student Agent",
        role: "agent",
        isStudent: true,
        timeLimit: 45,
        taskGoal: "Thank caller, use reflective paraphrasing ('So if I understand correctly...') to confirm the issue, and recommend the actionable next step (check VPN connection).",
        hints: [
          "Thanks & Paraphrase: 'Thank you for checking that for me. So if I understand correctly, your credentials are accepted, but the connection times out with Error 504 over home Wi-Fi.'",
          "Next Step: 'Could you please specify whether you have activated your company VPN before launching the portal?'"
        ],
        modelResponse: "Thank you for checking that for me. So if I understand correctly, your credentials are accepted, but the connection times out with Error 504 over home Wi-Fi. Could you please specify whether you have activated your company VPN before launching the portal?",
        modelAnalysis: "Reflective paraphrasing aligns technical facts, and indirect check smoothly guides caller to VPN isolation."
      }
    ],
    postTask: {
      modelDialogue: [
        { turn: 1, speaker: "Customer", text: "Hi, helpdesk? Look, I'm trying to log into the company portal to submit my urgent report, but it's completely broken! The screen just gave me some weird error and won't let me in. I really need to send this within the next twenty minutes!", purpose: "Vague emotional complaint under time pressure" },
        { turn: 2, speaker: "Agent (Golf)", text: "I understand how critical this submission is for you, and I can certainly help you resolve this right away. To diagnose the problem, could you please read me the exact error message or code displayed on your screen?", purpose: "Empathy + Indirect Diagnostic Probing" },
        { turn: 3, speaker: "Customer", text: "Let me check... Okay, a pop-up says 'Authentication Timeout - Error 504 Gateway'. But I'm sure I typed my password correctly, and my laptop is connected to my home Wi-Fi.", purpose: "Caller provides specific diagnostic facts" },
        { turn: 4, speaker: "Agent (Golf)", text: "Thank you for checking that for me. So if I understand correctly, your credentials are accepted, but the connection times out with Error 504 over home Wi-Fi. Could you please specify whether you have activated your company VPN before launching the portal?", purpose: "Reflective Paraphrasing + Actionable Diagnostic Step" }
      ],
      languageFunctions: [
        { phrasing: "I understand how critical this submission is for you...", function: "Empathetic De-escalation", rationale: "Prevents caller panic from escalating into formal complaints." },
        { phrasing: "Could you please read me the exact error message...?", function: "Indirect Diagnostic Question", rationale: "Softens tone while extracting actionable error strings." },
        { phrasing: "So if I understand correctly, your credentials are accepted...", function: "Reflective Paraphrasing", rationale: "Ensures mutual understanding and demonstrates active listening." },
        { phrasing: "Could you please specify whether you have activated your company VPN...?", function: "Isolation Probing", rationale: "Directs troubleshooting to the root cause without blaming the caller." }
      ],
      alternativeResponses: [
        {
          style: "Direct & Rapid Support",
          turn2: "I hear you, let's fix this immediately so you can submit your work. What does the pop-up error say?",
          turn4: "Got it. So the portal is unreachable from your home Wi-Fi. Please check if your company VPN icon in the system tray is green."
        },
        {
          style: "Formal Corporate Standard",
          turn2: "I apologize for the inconvenience this has caused ahead of your deadline. May I kindly request the exact error code displayed on your screen?",
          turn4: "Thank you for verifying those details. To confirm, you receive Error 504 on Wi-Fi. Would you mind checking whether your secure VPN tunnel is connected?"
        }
      ],
      selfAssessmentChecklist: [
        "I validated the caller's urgency empathetically before asking technical questions in Turn 2.",
        "I used indirect question phrasing ('Could you tell me...') with correct statement word order.",
        "I executed reflective paraphrasing ('So if I understand correctly...') in Turn 4.",
        "I connected the Error 504 code to the home Wi-Fi / VPN configuration."
      ]
    },
    audioPrompt: "Hi, helpdesk? Look, I'm trying to log into the company portal to submit my urgent report, but it's completely broken! The screen just gave me some weird error and won't let me in. I really need to send this within the next twenty minutes!",
    taskGoal: "Calmly acknowledge the caller's urgency with empathy, and use an indirect diagnostic question to ask for the exact error code or message.",
    timeLimit: 30,
    checklist: [
      "I validated caller urgency with calm empathy.",
      "I used an indirect question with statement word order.",
      "I used reflective paraphrasing to confirm diagnostic facts."
    ],
    hints: [
      "Empathy: 'I understand how critical this submission is for you, and I can certainly help you resolve this right away.'",
      "Indirect Question: 'Could you please tell me what exact error message or code appears on your screen?'"
    ],
    modelResponse: "I understand how critical this submission is for you, and I can certainly help you resolve this right away. To diagnose the problem, could you please read me the exact error message or code displayed on your screen?"
  },

  3: {
    id: 3,
    unitId: "lesson_3",
    title: "Lesson 3: Troubleshooting and Explaining Technical Problems",
    shortTitle: "Explaining Technical Problems",
    workplace: "Global Technical Helpdesk Service Desk",
    callerName: "Enterprise Employee (Reporting Portal)",
    scenario: "An enterprise user is locked out of the company reporting portal due to Error 504 with an urgent deadline in 20 minutes.",
    durationTotalMinutes: 150,
    preTask: {
      usefulExpressions: [
        {
          category: "Translating Jargon to Plain English",
          examples: [
            "It looks like your browser is holding on to an expired session token rather than an issue with your password.",
            "In non-technical terms, your browser's temporary storage is conflicting with our updated security certificate.",
            "This simply means your device is trying to use an old saved session."
          ]
        },
        {
          category: "First Conditional Technical Workarounds",
          examples: [
            "If you clear your browser cache and refresh, you will be able to log in immediately.",
            "If you open an incognito private window, the portal will bypass the cached credentials.",
            "If we reset your temporary session cookie, your dashboard will load normally."
          ]
        },
        {
          category: "Collaborative Verification",
          examples: [
            "Would you mind testing that right now while I stay on the line?",
            "Please go ahead and press Ctrl + Shift + Delete, and let me know what you see.",
            "I will wait right here with you while the page reloads."
          ]
        }
      ],
      vocabulary: [
        { customerPhrase: "Cached credentials", technicalTerm: "Stored Session Cookies / Tokens", meaning: "Locally saved authentication state that has expired on the authentication server." },
        { customerPhrase: "Weird pop-up froze", technicalTerm: "Session Interruption / Modal Crash", meaning: "Browser dialog box preventing user navigation due to timeout." },
        { customerPhrase: "Clear cookies", technicalTerm: "Browser Cache Invalidation", meaning: "Purging temporary web assets to force fresh server handshake." },
        { customerPhrase: "Quick fix", technicalTerm: "Procedural Workaround", meaning: "Immediate resolution steps that restore productivity without code-level fix." }
      ],
      grammarFocus: {
        title: "First Conditional for Technical Solutions",
        syntax: "If + Subject + Present Simple, Subject + will + Base Verb [Real Possibility / Guaranteed Result]",
        bad: "If you will clear your cache, you can log in. (Incorrect will in if-clause)",
        good: "If you clear your browser cache, you will be able to log in immediately."
      }
    },
    turns: [
      {
        turnNumber: 1,
        speaker: "Customer",
        role: "caller",
        isStudent: false,
        audioPrompt: "Hello, helpdesk? I can't get into the company reporting portal at all! The screen just popped up with some weird error code and froze, and I have an urgent report due in twenty minutes!",
        tone: "Anxious and hurried",
        timeLimit: 20
      },
      {
        turnNumber: 2,
        speaker: "Student Agent",
        role: "agent",
        isStudent: true,
        timeLimit: 30,
        taskGoal: "Express genuine empathy for the deadline, offer immediate help, and politely ask for the exact error code appearing on the screen.",
        hints: [
          "Empathy: 'I completely understand your concern regarding the upcoming deadline. Let me help you get back in right away.'",
          "Modal Question: 'Could you please read me the exact error code appearing on the screen?'"
        ],
        modelResponse: "I completely understand your concern regarding the upcoming deadline. Let me help you get back in right away. Could you please read me the exact error code appearing on the screen?",
        modelAnalysis: "Quickly reduces panic and targets the technical error string without delay."
      },
      {
        turnNumber: 3,
        speaker: "Customer",
        role: "caller",
        isStudent: false,
        audioPrompt: "Let me check... Okay, the pop-up says 'Error 504: Session Interrupted - Invalid Cached Credentials'. But I know for sure that my username and password are correct because I just used them this morning!",
        tone: "Puzzled, defending their password correctness",
        timeLimit: 25
      },
      {
        turnNumber: 4,
        speaker: "Student Agent",
        role: "agent",
        isStudent: true,
        timeLimit: 45,
        taskGoal: "Explain root cause in plain English (browser cache conflict, not password fault), provide First Conditional workaround, and request collaborative verification on the line.",
        hints: [
          "Plain English: 'Thank you for that information. It looks like your browser is holding on to an expired session token rather than an issue with your password.'",
          "First Conditional: 'If you clear your browser cache and refresh the page, you will be able to log in immediately.'",
          "Verification: 'Would you mind testing that right now while I stay on the line?'"
        ],
        modelResponse: "Thank you for that information. It looks like your browser is holding on to an expired session token rather than an issue with your password. If you clear your browser cache and refresh the page, you will be able to log in immediately. Would you mind testing that right now while I stay on the line?",
        modelAnalysis: "Reassures user their password is fine, explains cause simply, and uses First Conditional for confident guidance."
      }
    ],
    postTask: {
      modelDialogue: [
        { turn: 1, speaker: "Customer", text: "Hello, helpdesk? I can't get into the company reporting portal at all! The screen just popped up with some weird error code and froze, and I have an urgent report due in twenty minutes!", purpose: "Customer urgency and problem announcement" },
        { turn: 2, speaker: "Agent", text: "I completely understand your concern regarding the upcoming deadline. Let me help you get back in right away. Could you please read me the exact error code appearing on the screen?", purpose: "Empathy + Polite Modal Diagnostic Inquiry" },
        { turn: 3, speaker: "Customer", text: "Let me check... Okay, the pop-up says 'Error 504: Session Interrupted - Invalid Cached Credentials'. But I know for sure that my username and password are correct because I just used them this morning!", purpose: "Error string identification & credential clarification" },
        { turn: 4, speaker: "Agent", text: "Thank you for that information. It looks like your browser is holding on to an expired session token rather than an issue with your password. If you clear your browser cache and refresh the page, you will be able to log in immediately. Would you mind testing that right now while I stay on the line?", purpose: "De-jargonized Explanation + First Conditional Workaround + Collaborative Verification" }
      ],
      languageFunctions: [
        { phrasing: "It looks like your browser is holding on to an expired session token...", function: "De-jargonizing Technical Glitch", rationale: "Prevents customer feeling blamed for entering wrong credentials." },
        { phrasing: "If you clear your browser cache..., you will be able to log in...", function: "First Conditional Procedural Workaround", rationale: "Creates confidence by showing cause-and-effect relationship of solution." },
        { phrasing: "Would you mind testing that right now while I stay on the line?", function: "Collaborative Verification", rationale: "Prevents repeat calls (FCR - First Contact Resolution optimization)." }
      ],
      alternativeResponses: [
        {
          style: "Fast Direct Fix",
          turn2: "I hear you, let's fix this immediately so you can submit your work. What does the pop-up error say?",
          turn4: "Your credentials are good—it's just old cookies blocking the login. If you open an Incognito tab, you will get into the portal in 10 seconds. Try that now!"
        },
        {
          style: "Formal Helpdesk Specialist",
          turn2: "I apologize for the inconvenience this has caused ahead of your deadline. May I kindly request the exact error code displayed on your screen?",
          turn4: "I recommend that we clear your temporary session data. If you access the portal via a new private browser session, the server will refresh your token immediately. I will remain on the line."
        }
      ],
      selfAssessmentChecklist: [
        "I validated caller concern and asked for the error code with polite modals in Turn 2.",
        "I explained the technical fault in plain English without blaming user credentials.",
        "I constructed a grammatically accurate First Conditional sentence ('If you [present], you will [verb]').",
        "I offered to stay on the line for real-time collaborative verification in Turn 4."
      ]
    },
    audioPrompt: "Hello, helpdesk? I can't get into the company reporting portal at all! The screen just popped up with some weird error code and froze, and I have an urgent report due in twenty minutes!",
    taskGoal: "Express genuine empathy for the deadline, offer immediate help, and politely ask for the exact error code appearing on the screen.",
    timeLimit: 30,
    checklist: [
      "I validated caller concern with empathy.",
      "I used First Conditional for procedural solution.",
      "I offered collaborative verification on the line."
    ],
    hints: [
      "Empathy: 'I completely understand your concern regarding the upcoming deadline.'",
      "First Conditional: 'If you clear your browser cache, you will be able to log in immediately.'"
    ],
    modelResponse: "I completely understand your concern regarding the upcoming deadline. Let me help you get back in right away. Could you please read me the exact error code appearing on the screen?"
  },

  4: {
    id: 4,
    unitId: "lesson_4",
    title: "Lesson 4: Handling Complaints and Responding Empathetically",
    shortTitle: "Handling Complaints & De-escalation",
    workplace: "Customer Complaint Operations & Cloud Services",
    callerName: "David Miller (Cloud Storage Subscriber)",
    scenario: "David Miller calls furious because his mobile banking statement shows he was charged twice ($30 duplicate charge) for his cloud storage subscription.",
    durationTotalMinutes: 120,
    preTask: {
      usefulExpressions: [
        {
          category: "HEAR Framework - Empathetic Validation",
          examples: [
            "I completely understand how frustrating and concerning an unexpected duplicate charge is on your account.",
            "I hear your frustration, Mr. Miller, and you have every right to be upset about this billing discrepancy.",
            "I appreciate you bringing this duplicate charge to our immediate attention."
          ]
        },
        {
          category: "HEAR Framework - Formal Corporate Apology",
          examples: [
            "On behalf of our company, I sincerely apologize for this billing error.",
            "Please accept our sincere apologies for the stress and inconvenience this has caused you.",
            "I am deeply sorry that this billing glitch occurred on your statement."
          ]
        },
        {
          category: "Personal Ownership & Service Recovery",
          examples: [
            "Rest assured that I am taking personal ownership of your account right now.",
            "I have just verified the duplicate transaction and processed an immediate refund of thirty dollars.",
            "As a gesture of goodwill for the inconvenience, I am also applying a one-month service credit to your account."
          ]
        }
      ],
      vocabulary: [
        { customerPhrase: "You charged me twice / taking my money", technicalTerm: "Duplicate Transaction Glitch", meaning: "System captured dual authorization tokens for a single billing cycle." },
        { customerPhrase: "Completely ridiculous", technicalTerm: "High-Severity Customer Grievance (CSAT Risk)", meaning: "Customer escalation requiring immediate de-escalation protocol." },
        { customerPhrase: "Refund it right now", technicalTerm: "Immediate Chargeback / Gateway Reversal", meaning: "Initiating automated refund reversal through payment processor." },
        { customerPhrase: "Goodwill gesture", technicalTerm: "Service Credit / Customer Retention Concession", meaning: "Complimentary credit applied to account to restore brand loyalty." }
      ],
      grammarFocus: {
        title: "De-escalation Language & Past Continuous vs Present Perfect",
        syntax: "Empathetic Validation + Corporate Apology + Personal Ownership ('I am taking...') + Present Perfect Action ('I have just processed...')",
        bad: "Calm down, it's just thirty dollars. You need to wait for our finance team.",
        good: "I sincerely apologize for this duplicate charge, Mr. Miller. I have just processed an immediate refund back to your card."
      }
    },
    turns: [
      {
        turnNumber: 1,
        speaker: "Customer (David Miller)",
        role: "caller",
        isStudent: false,
        audioPrompt: "I just checked my mobile banking statement and you charged me TWICE for my cloud storage subscription! This is completely ridiculous! You people keep taking money from my account without authorization. I want this resolved and refunded right now!",
        tone: "Furious, aggressive, and highly impatient",
        timeLimit: 25
      },
      {
        turnNumber: 2,
        speaker: "Student Agent",
        role: "agent",
        isStudent: true,
        timeLimit: 45,
        taskGoal: "Apply HEAR Framework: Empathetic validation of caller's anger, formal corporate apology on behalf of the company, and polite request for registered email and transaction reference.",
        hints: [
          "Validation: 'I completely understand how frustrating and concerning an unexpected duplicate charge is on your account, Mr. Miller.'",
          "Apology: 'On behalf of our company, I sincerely apologize for this billing error. I will take care of this for you immediately.'",
          "Probing: 'To help me locate your file, may I please have your registered email address and the transaction reference number?'"
        ],
        modelResponse: "I completely understand how frustrating and concerning an unexpected duplicate charge is on your account, Mr. Miller. On behalf of our company, I sincerely apologize for this billing error. I will take care of this for you immediately. To help me locate your file, may I please have your registered email address and the transaction reference number?",
        modelAnalysis: "Does not tell caller to 'calm down', uses formal apology, acknowledges financial stress, and requests diagnostic details politely."
      },
      {
        turnNumber: 3,
        speaker: "Customer (David Miller)",
        role: "caller",
        isStudent: false,
        audioPrompt: "Fine! My registered email address is david.miller@techcorp.com, and the transaction reference on my app says TXN-9982. Can you fix this right now? I don't have time to wait around!",
        tone: "Still abrupt, but complies with providing information",
        timeLimit: 20
      },
      {
        turnNumber: 4,
        speaker: "Student Agent",
        role: "agent",
        isStudent: true,
        timeLimit: 60,
        taskGoal: "Demonstrate personal ownership, confirm $30 refund has been initiated with clear timelines (15 min confirmation, 1-2 business days bank), and apply a 1-month service credit goodwill gesture.",
        hints: [
          "Ownership: 'Thank you for that information, Mr. Miller. Rest assured that I am taking personal ownership of your account right now.'",
          "Resolution: 'I have just verified the duplicate transaction and processed an immediate refund of thirty dollars back to your original payment method.'",
          "Timeline & Goodwill: 'You will receive an official credit confirmation email within fifteen minutes, and the funds will reflect in your account within one to two business days. I am also applying a one-month service credit as a goodwill gesture.'"
        ],
        modelResponse: "Thank you for that information, Mr. Miller. Rest assured that I am taking personal ownership of your account right now. I have just verified the duplicate transaction and processed an immediate refund of thirty dollars back to your original payment method. You will receive an official credit confirmation email within fifteen minutes, and the funds will reflect in your account within one to two business days. I am also applying a one-month service credit to your account as a goodwill gesture for the inconvenience.",
        modelAnalysis: "High-scoring de-escalation: specific dollar amount, exact timelines, personal accountability, and tangible customer retention value."
      }
    ],
    postTask: {
      modelDialogue: [
        { turn: 1, speaker: "Customer (David Miller)", text: "I just checked my mobile banking statement and you charged me TWICE for my cloud storage subscription! This is completely ridiculous! You people keep taking money from my account without authorization. I want this resolved and refunded right now!", purpose: "High-intensity customer complaint & refund demand" },
        { turn: 2, speaker: "Agent (Pear)", text: "I completely understand how frustrating and concerning an unexpected duplicate charge is on your account, Mr. Miller. On behalf of our company, I sincerely apologize for this billing error. I will take care of this for you immediately. To help me locate your file, may I please have your registered email address and the transaction reference number?", purpose: "HEAR Validation + Corporate Apology + Data Verification" },
        { turn: 3, speaker: "Customer (David Miller)", text: "Fine! My registered email address is david.miller@techcorp.com, and the transaction reference on my app says TXN-9982. Can you fix this right now? I don't have time to wait around!", purpose: "Customer complies with verification details" },
        { turn: 4, speaker: "Agent (Pear)", text: "Thank you for that information, Mr. Miller. Rest assured that I am taking personal ownership of your account right now. I have just verified the duplicate transaction and processed an immediate refund of thirty dollars back to your original payment method. You will receive an official credit confirmation email within fifteen minutes, and the funds will reflect in your account within one to two business days. I am also applying a one-month service credit to your account as a goodwill gesture for the inconvenience.", purpose: "Personal Ownership + Financial Resolution + SLA Timelines + Goodwill Retention" }
      ],
      languageFunctions: [
        { phrasing: "I completely understand how frustrating and concerning...", function: "Empathetic Validation (Hear/Empathize)", rationale: "Acknowledges caller emotion directly without dismissiveness." },
        { phrasing: "On behalf of our company, I sincerely apologize...", function: "Official Corporate Apology (Apologize)", rationale: "De-escalates hostility by accepting corporate accountability." },
        { phrasing: "Rest assured that I am taking personal ownership...", function: "Personal Ownership Commitment", rationale: "Reassures customer they will not be bounced between departments." },
        { phrasing: "I am applying a one-month service credit as a goodwill gesture...", function: "Goodwill Service Recovery", rationale: "Restores brand trust and prevents subscription cancellation." }
      ],
      alternativeResponses: [
        {
          style: "Direct Solution Style",
          turn2: "I hear your frustration, Mr. Miller, and I apologize for this duplicate charge. Let's get your refund started right now. May I confirm your registered email address?",
          turn4: "I've cancelled the duplicate $30 charge right now. You will see the email receipt in 10 minutes and bank credit in 1-2 days. I've also credited your account for next month."
        },
        {
          style: "Executive VIP Service",
          turn2: "Please accept our sincere apologies for this billing discrepancy, Mr. Miller. I completely share your concern regarding unauthorized charges. Allow me to rectify this immediately. Could you verify your account reference?",
          turn4: "Thank you, Mr. Miller. I have escalated this directly to our billing gateway, authorized a full refund, and personally added a goodwill VIP waiver to your account."
        }
      ],
      selfAssessmentChecklist: [
        "I validated the caller's anger without arguing or saying 'calm down' in Turn 2.",
        "I delivered a sincere corporate apology on behalf of the company.",
        "I stated personal ownership ('I am taking personal charge...') in Turn 4.",
        "I gave specific financial refund amounts and turnaround timelines (15 mins / 1-2 days).",
        "I offered a proactive goodwill compensation gesture to restore customer trust."
      ]
    },
    audioPrompt: "I just checked my mobile banking statement and you charged me TWICE for my cloud storage subscription! This is completely ridiculous! You people keep taking money from my account without authorization. I want this resolved and refunded right now!",
    taskGoal: "Apply HEAR Framework: Empathetic validation of caller's anger, formal corporate apology on behalf of the company, and polite request for registered email and transaction reference.",
    timeLimit: 45,
    checklist: [
      "I validated customer frustration with empathy.",
      "I delivered a formal corporate apology.",
      "I confirmed refund amount and timeline with personal ownership."
    ],
    hints: [
      "Validation: 'I completely understand how frustrating an unexpected duplicate charge is.'",
      "Apology: 'On behalf of our company, I sincerely apologize for this billing error.'",
      "Ownership: 'Rest assured I am taking personal ownership of your account right now.'"
    ],
    modelResponse: "I completely understand how frustrating and concerning an unexpected duplicate charge is on your account, Mr. Miller. On behalf of our company, I sincerely apologize for this billing error. I will take care of this for you immediately. To help me locate your file, may I please have your registered email address and the transaction reference number?"
  },

  5: {
    id: 5,
    unitId: "lesson_5",
    title: "Lesson 5: Giving Clear Instructions and Checking Understanding",
    shortTitle: "Giving Clear Instructions",
    workplace: "Multinational IT Helpdesk & Remote Service Center",
    callerName: "Enterprise User (Work Portal)",
    scenario: "An enterprise user cannot access the company work portal with an urgent report due in 20 minutes, seeing 'Invalid Credentials or Session Expired'.",
    durationTotalMinutes: 120,
    preTask: {
      usefulExpressions: [
        {
          category: "Sequential Transition Markers",
          examples: [
            "First, please click on the 'Reset Password' link directly beneath the sign-in field.",
            "Next, enter your employee ID and select 'Send Verification Code'.",
            "Finally, check your corporate email on your mobile device for the security link."
          ]
        },
        {
          category: "Imperative Action Verbs",
          examples: [
            "Click on the blue 'Account Recovery' button.",
            "Type in your staff ID number.",
            "Refresh the browser page by pressing F5.",
            "Verify whether the two-factor authentication box appears."
          ]
        },
        {
          category: "Visual Comprehension Checks (Screen Alignment)",
          examples: [
            "Does the green confirmation banner appear on your screen?",
            "What message do you see in the dialog box right now?",
            "Can you confirm whether the page displays 'Verification Code Sent'?"
          ]
        }
      ],
      vocabulary: [
        { customerPhrase: "Strange error on my screen", technicalTerm: "Session Invalidation / Expired Token", meaning: "Security token has timed out, requiring fresh authentication." },
        { customerPhrase: "Red box popped up", technicalTerm: "Modal Alert Dialog", meaning: "Pop-up UI component notifying user of credential or access failure." },
        { customerPhrase: "Send verification code", technicalTerm: "One-Time Password (OTP) Dispatch", meaning: "Dispatching multi-factor token to registered mobile or email." },
        { customerPhrase: "Green checkmark", technicalTerm: "Visual Confirmation Prompt", meaning: "UI indicator proving successful system update." }
      ],
      grammarFocus: {
        title: "Imperative Instructions with Sequence Markers",
        syntax: "[Transition: First/Next/Then/Finally] + [Imperative Verb: Click/Enter/Select] + [Object] + [Location] + [Visual Check]?",
        bad: "You have to maybe go and click somewhere in the settings or something. You understand?",
        good: "First, click on 'Reset Password' below the login box. Next, enter your employee ID. Does the confirmation box appear?"
      }
    },
    turns: [
      {
        turnNumber: 1,
        speaker: "Customer",
        role: "caller",
        isStudent: false,
        audioPrompt: "Hi, I really need help! I can't access the company work portal at all, and it's throwing some strange error on my screen. I have an urgent report due in 20 minutes!",
        tone: "Stressed, urgent, and seeking immediate guidance",
        timeLimit: 20
      },
      {
        turnNumber: 2,
        speaker: "Student Agent",
        role: "agent",
        isStudent: true,
        timeLimit: 45,
        taskGoal: "Acknowledge the caller's distress empathetically, reassure immediate assistance, and ask a specific probing question for the visual error text on screen.",
        hints: [
          "Empathy: 'I understand how urgent this is for your report submission, and I'd be glad to help you resolve this right away.'",
          "Probing: 'Could you please read me the exact error message displayed in that dialog box?'"
        ],
        modelResponse: "I understand how urgent this is for your report submission, and I'd be glad to help you resolve this right away. Could you please read me the exact error message displayed in that dialog box?",
        modelAnalysis: "Immediate empathy addresses panic before technical probing extracts the screen error text."
      },
      {
        turnNumber: 3,
        speaker: "Customer",
        role: "caller",
        isStudent: false,
        audioPrompt: "Okay... the red box says 'Invalid Credentials or Session Expired', but I'm absolutely certain I typed my password correctly. What should I do now?",
        tone: "Cooperative, reads specific text, looking for step-by-step guidance",
        timeLimit: 20
      },
      {
        turnNumber: 4,
        speaker: "Student Agent",
        role: "agent",
        isStudent: true,
        timeLimit: 60,
        taskGoal: "Deliver sequential instructions using transition markers (First, Next, Finally), use imperative action verbs, and close with a precise visual confirmation check.",
        hints: [
          "Acknowledge: 'Thank you for checking that.'",
          "First Step: 'First, please click on the 'Reset Password' link directly beneath the sign-in field.'",
          "Next Step: 'Next, enter your employee ID and click 'Send Verification Code'.' ",
          "Finally: 'Finally, check your corporate email on your mobile phone for the reset link.'",
          "Visual Check: 'Does the confirmation prompt appear on your screen?'"
        ],
        modelResponse: "Thank you for checking that. First, please click on the 'Reset Password' link directly beneath the sign-in field. Next, enter your employee ID and click 'Send Verification Code'. Finally, check your corporate email on your mobile phone for the reset link. Does the confirmation prompt appear on your screen?",
        modelAnalysis: "Paces instructions step-by-step without cognitive overload, ending with a specific visual confirmation question."
      }
    ],
    postTask: {
      modelDialogue: [
        { turn: 1, speaker: "Customer", text: "Hi, I really need help! I can't access the company work portal at all, and it's throwing some strange error on my screen. I have an urgent report due in 20 minutes!", purpose: "Caller distressed by error barrier before deadline" },
        { turn: 2, speaker: "Agent (Mei)", text: "I understand how urgent this is for your report submission, and I'd be glad to help you resolve this right away. Could you please read me the exact error message displayed in that dialog box?", purpose: "Empathy + Specific Screen Probing" },
        { turn: 3, speaker: "Customer", text: "Okay... the red box says 'Invalid Credentials or Session Expired', but I'm absolutely certain I typed my password correctly. What should I do now?", purpose: "Caller provides exact error text" },
        { turn: 4, speaker: "Agent (Mei)", text: "Thank you for checking that. First, please click on the 'Reset Password' link directly beneath the sign-in field. Next, enter your employee ID and click 'Send Verification Code'. Finally, check your corporate email on your mobile phone for the reset link. Does the confirmation prompt appear on your screen?", purpose: "Sequential Imperatives + Visual Screen Alignment" }
      ],
      languageFunctions: [
        { phrasing: "I understand how urgent this is for your report submission...", function: "Cognitive Load Reduction", rationale: "Calms user so they can listen attentively to multi-step instructions." },
        { phrasing: "First, please click... Next, enter... Finally, check...", function: "Sequential Imperative Staging", rationale: "Prevents user skipping critical authentication milestones." },
        { phrasing: "Does the confirmation prompt appear on your screen?", function: "Visual Screen Alignment Check", rationale: "Replaces vague 'Do you understand?' with verifiable on-screen evidence." }
      ],
      alternativeResponses: [
        {
          style: "Direct & Rapid Support",
          turn2: "Don't worry, let's get you back in. What specific error message are you seeing on the screen?",
          turn4: "First, open an incognito browser window. Next, go to the portal link and enter your credentials again. Do you see the login dashboard now?"
        },
        {
          style: "Formal Corporate Standard",
          turn2: "I completely understand your concern with the deadline. I can definitely assist you. Could you please tell me what is written in the error box?",
          turn4: "First, please clear your browser cache. Next, refresh the page and enter your credentials. Does the green two-factor authentication prompt display?"
        }
      ],
      selfAssessmentChecklist: [
        "I acknowledged caller distress empathetically before starting instructions in Turn 2.",
        "I used clear sequence transition words (First, Next, Finally) in Turn 4.",
        "I began instructional clauses with action imperative verbs (Click, Enter, Check).",
        "I ended with a visual check ('Does ... appear on your screen?') instead of 'Do you understand?'."
      ]
    },
    audioPrompt: "Hi, I really need help! I can't access the company work portal at all, and it's throwing some strange error on my screen. I have an urgent report due in 20 minutes!",
    taskGoal: "Acknowledge caller distress empathetically, reassure immediate assistance, and ask a specific probing question for the visual error text on screen.",
    timeLimit: 45,
    checklist: [
      "I acknowledged user deadline with empathy.",
      "I delivered sequential instructions using First, Next, Finally.",
      "I concluded with a visual confirmation check."
    ],
    hints: [
      "Empathy: 'I understand how urgent this is, and I'd be glad to help.'",
      "Sequencing: 'First, click on Reset Password. Next, enter your ID. Does the prompt appear?'"
    ],
    modelResponse: "I understand how urgent this is for your report submission, and I'd be glad to help you resolve this right away. Could you please read me the exact error message displayed in that dialog box?"
  },

  6: {
    id: 6,
    unitId: "lesson_6",
    title: "Lesson 6: Escalating Unresolved Cases and Explaining Next Steps",
    shortTitle: "Case Escalation & SLAs",
    workplace: "Frontline IT Support (Tier-1) in BPO / IT Service Desk",
    callerName: "Store Operations Manager (Regional ERP)",
    scenario: "Regional ERP portal completely crashed during monthly inventory sync with an Error 503 backend timeout, blocking store transactions 1 hour before audit.",
    durationTotalMinutes: 120,
    preTask: {
      usefulExpressions: [
        {
          category: "Non-Blaming Escalation Framing",
          examples: [
            "Due to the backend nature of this infrastructure fault, this requires specialized database server intervention.",
            "Because this issue involves database node synchronization, I am escalating your ticket directly to Tier-2.",
            "To ensure the quickest resolution, this case is being assigned to our senior infrastructure pod."
          ]
        },
        {
          category: "Priority Classification & Ticket Referencing",
          examples: [
            "Given the operational impact on your store transactions, I have tagged this as a Priority 1 Critical Incident.",
            "Your case has been logged under Ticket Reference ID #TK-9942.",
            "Please record Ticket Number TK-9942 for direct status tracking."
          ]
        },
        {
          category: "SLA Commitment & Ongoing Case Ownership",
          examples: [
            "Under our Service Level Agreement, our database engineers will investigate and contact you within 30 minutes.",
            "You will receive a direct technical update within thirty minutes from our lead engineer.",
            "In the meantime, I am personally attaching all system logs and will actively monitor this case until resolved."
          ]
        }
      ],
      vocabulary: [
        { customerPhrase: "Portal completely crashed", technicalTerm: "P1 Critical System Outage", meaning: "High-impact incident halting revenue-generating core business functions." },
        { customerPhrase: "Bizarre connection error / Error 503", technicalTerm: "Backend Node Synchronization Timeout", meaning: "Master database cluster unreachable by application API gateway." },
        { customerPhrase: "Fix this right now", technicalTerm: "Exceeds Tier-1 Scope of Support", meaning: "Requires root-level access and server database re-indexing." },
        { customerPhrase: "Update in 30 minutes", technicalTerm: "SLA Turnaround Time (TAT) Commitment", meaning: "Contractually agreed maximum time before mandatory status communication." }
      ],
      grammarFocus: {
        title: "Escalation Rationale ('Due to...' / 'Because of...')",
        syntax: "Due to + [Noun Phrase: the backend nature of this fault], [Escalation Action: I am escalating your ticket to Tier-2].",
        bad: "We cannot fix it here because Tier-1 doesn't have privileges and our server team is slow.",
        good: "Due to the backend infrastructure nature of this glitch, I am routing this directly to Tier-2 Database Engineering."
      }
    },
    turns: [
      {
        turnNumber: 1,
        speaker: "Customer (Operations Manager)",
        role: "caller",
        isStudent: false,
        audioPrompt: "Helpdesk? Hi, listen, our regional ERP portal completely crashed while we were syncing monthly inventory data! It's showing some bizarre database connection error and none of our store managers can complete transactions. We have a massive audit deadline in an hour, this is an absolute disaster!",
        tone: "Agitated, highly urgent, and stressed by audit deadline",
        timeLimit: 25
      },
      {
        turnNumber: 2,
        speaker: "Student Agent",
        role: "agent",
        isStudent: true,
        timeLimit: 45,
        taskGoal: "Acknowledge caller distress empathetically, validate the business audit urgency, and calmly probe for the specific error message or system code on screen.",
        hints: [
          "Empathy: 'I completely understand the critical urgency of this situation, and I know how important this audit deadline is for your operations.'",
          "Reassurance: 'Please rest assured that I am here to help you get this resolved.'",
          "Probe Error: 'To help me identify the exact root cause, could you please read me the specific error message or system code currently displayed on your screen?'"
        ],
        modelResponse: "I completely understand the critical urgency of this situation, and I know how important this audit deadline is for your operations. Please rest assured that I am here to help you get this resolved. To help me identify the exact root cause, could you please read me the specific error message or system code currently displayed on your screen?",
        modelAnalysis: "Validates severe business impact without panic, maintaining professional control of the incident."
      },
      {
        turnNumber: 3,
        speaker: "Customer (Operations Manager)",
        role: "caller",
        isStudent: false,
        audioPrompt: "Right, the exact red box says 'Error 503: Backend Database Node Synchronization Timeout - Master Node Unreachable'. I tried restarting my browser and flushing DNS like we usually do, but it's clearly a central system issue. Can't you just fix this right now from your side?",
        tone: "Anxious, demanding immediate frontline fix",
        timeLimit: 25
      },
      {
        turnNumber: 4,
        speaker: "Student Agent",
        role: "agent",
        isStudent: true,
        timeLimit: 60,
        taskGoal: "Explain escalation without assigning blame using 'Due to...', escalate to Tier-2 Database Engineering, classify as Priority 1 with Ticket #TK-9942, commit to 30-min SLA update, and reassure case ownership.",
        hints: [
          "Due to: 'Due to the backend nature of this infrastructure fault, I am escalating your ticket directly to our Tier-2 Database Engineering Team.'",
          "Priority & Ticket: 'Given the operational impact on your stores, I have tagged this as a Priority 1 Critical Incident under Ticket ID #TK-9942.'",
          "SLA Commitment: 'Under our Service Level Agreement, our senior database engineers will investigate the master node and contact you with a direct status update within 30 minutes.'",
          "Ownership: 'In the meantime, I am personally attaching all system logs to the handover file and will actively track this case until resolution.'"
        ],
        modelResponse: "Thank you for providing that specific error code. Because this issue involves backend database node synchronization, it requires direct administrative intervention from our specialized server engineers. Due to the backend nature of this infrastructure fault, I am escalating your ticket directly to our Tier-2 Database Engineering Team. Given the operational impact on your stores, I have tagged this as a Priority 1 Critical Incident under Ticket ID #TK-9942. Under our Service Level Agreement, our senior database engineers will investigate the master node and contact you with a direct status update within 30 minutes. In the meantime, I am personally attaching all system logs to the handover file and will actively track this case until resolution.",
        modelAnalysis: "Masterclass in escalation: objective technical justification ('Due to...'), P1 tagging, memorable Ticket ID, unambiguous SLA countdown, and end-to-end case stewardship."
      }
    ],
    postTask: {
      modelDialogue: [
        { turn: 1, speaker: "Customer", text: "Helpdesk? Hi, listen, our regional ERP portal completely crashed while we were syncing monthly inventory data! It's showing some bizarre database connection error and none of our store managers can complete transactions. We have a massive audit deadline in an hour, this is an absolute disaster!", purpose: "Business-critical incident report with audit panic" },
        { turn: 2, speaker: "Agent", text: "I completely understand the critical urgency of this situation, and I know how important this audit deadline is for your operations. Please rest assured that I am here to help you get this resolved. To help me identify the exact root cause, could you please read me the specific error message or system code currently displayed on your screen?", purpose: "Empathy + Business Urgency Validation + Error Probing" },
        { turn: 3, speaker: "Customer", text: "Right, the exact red box says 'Error 503: Backend Database Node Synchronization Timeout - Master Node Unreachable'. I tried restarting my browser and flushing DNS like we usually do, but it's clearly a central system issue. Can't you just fix this right now from your side?", purpose: "Identifies backend error & demands frontline fix" },
        { turn: 4, speaker: "Agent", text: "Thank you for providing that specific error code. Because this issue involves backend database node synchronization, it requires direct administrative intervention from our specialized server engineers. Due to the backend nature of this infrastructure fault, I am escalating your ticket directly to our Tier-2 Database Engineering Team. Given the operational impact on your stores, I have tagged this as a Priority 1 Critical Incident under Ticket ID #TK-9942. Under our Service Level Agreement, our senior database engineers will investigate the master node and contact you with a direct status update within 30 minutes. In the meantime, I am personally attaching all system logs to the handover file and will actively track this case until resolution.", purpose: "Objective Non-Blaming Escalation + P1 Classification + Ticket ID + 30-min SLA + Stewardship" }
      ],
      languageFunctions: [
        { phrasing: "Due to the backend nature of this infrastructure fault...", function: "Objective Rationale Framing", rationale: "Prevents customer feeling dismissed while maintaining confidence in frontline professionalism." },
        { phrasing: "Tagged as a Priority 1 Critical Incident under Ticket ID #TK-9942...", function: "Incident Tagging & Traceability", rationale: "Validates incident gravity and gives caller authoritative proof of prioritization." },
        { phrasing: "Contact you with a direct status update within 30 minutes...", function: "Definite SLA Turnaround Commitment", rationale: "Complies with BPO customer agreements and manages user anxiety with certainty." },
        { phrasing: "I am personally attaching all system logs and will track this...", function: "Personal Case Stewardship", rationale: "Prevents caller feeling abandoned by an automated ticket handoff." }
      ],
      alternativeResponses: [
        {
          style: "Executive Escalation",
          turn2: "I recognize the operational urgency for your audit, and I am treating this with the highest priority. Could you read the specific error displayed?",
          turn4: "Because this is an active database outage, I have opened Critical Ticket TK-9942 with our Tier-2 Engineering Pod. They are already on the bridge and will update you in 30 minutes."
        },
        {
          style: "Standard Helpdesk Protocol",
          turn2: "I understand how serious this interruption is for your stores. Let's isolate the root cause immediately—what error message appears?",
          turn4: "Thank you. Due to database synchronization requirements, I am assigning Ticket #TK-9942 to Server Support. You have our 30-minute SLA commitment, and I will track this until closure."
        }
      ],
      selfAssessmentChecklist: [
        "I validated the business urgency and audit deadline in Turn 2.",
        "I explained the escalation reason objectively without blaming internal staff ('Due to...').",
        "I clearly stated the Priority classification (P1) and Ticket ID (#TK-9942).",
        "I set an exact SLA turnaround time (30 minutes) for the next communication.",
        "I assured ongoing personal ownership and case monitoring in Turn 4."
      ]
    },
    audioPrompt: "Helpdesk? Hi, listen, our regional ERP portal completely crashed while we were syncing monthly inventory data! It's showing some bizarre database connection error and none of our store managers can complete transactions. We have a massive audit deadline in an hour, this is an absolute disaster!",
    taskGoal: "Acknowledge caller distress empathetically, validate the business audit urgency, and calmly probe for the specific error message or system code on screen.",
    timeLimit: 45,
    checklist: [
      "I validated audit deadline urgency.",
      "I used objective 'Due to...' escalation framing.",
      "I stated Ticket #TK-9942 and 30-min SLA commitment."
    ],
    hints: [
      "Urgency: 'I completely understand the critical urgency of this situation.'",
      "Escalation: 'Due to the backend nature of this fault, I am escalating Ticket #TK-9942 to Tier-2 with a 30-minute SLA.'"
    ],
    modelResponse: "I completely understand the critical urgency of this situation, and I know how important this audit deadline is for your operations. Please rest assured that I am here to help you get this resolved. To help me identify the exact root cause, could you please read me the specific error message or system code currently displayed on your screen?"
  },

  7: {
    id: 7,
    unitId: "lesson_7",
    title: "Lesson 7: Troubleshooting Merchant Portal Access & CRM Case Documentation",
    shortTitle: "Merchant Portal Access & CRM Case Documentation",
    workplace: "Merchant Services Technical Support Desk",
    callerName: "Khun Somchai (Online E-Commerce Merchant)",
    scenario: "Khun Somchai cannot log into his Merchant Portal to check his daily payout, seeing 'Account Temporarily Locked' with clients waiting.",
    durationTotalMinutes: 120,
    preTask: {
      usefulExpressions: [
        {
          category: "Empathy & Reassurance Phrases",
          examples: [
            "I completely understand how urgent this is for your business, and I deeply apologize for the inconvenience.",
            "Please don't worry, Khun Somchai, I am here to help you regain access right away.",
            "Rest assured that your account funds are completely secure."
          ]
        },
        {
          category: "Probing & Verification Questions",
          examples: [
            "To get started, may I please verify your full name and registered Merchant ID for security purposes?",
            "Could you describe what happens when you attempt to log in?",
            "May I confirm if you received an automated notification email from our security team?"
          ]
        },
        {
          category: "Sequencing Instructions for Password Recovery",
          examples: [
            "First, please check your registered email inbox for an automated password reset link we just dispatched.",
            "Next, click the link and set a new password complying with our standard security criteria.",
            "Finally, log back in using your new credentials."
          ]
        }
      ],
      vocabulary: [
        { customerPhrase: "Trying to check today's payout", technicalTerm: "Merchant Settlement & Payout Query", meaning: "Accessing automated daily revenue disbursement records." },
        { customerPhrase: "Account Temporarily Locked", technicalTerm: "Security Lockout Policy Enforcement", meaning: "Automated account freeze following 3 consecutive failed password attempts." },
        { customerPhrase: "Is my money safe?", technicalTerm: "Financial Asset Integrity Assurance", meaning: "Reassuring merchant that portal lockout does not impact backend settlement funds." },
        { customerPhrase: "Fix this immediately", technicalTerm: "High-Priority Merchant Restoration", meaning: "Restoring merchant credentials before business day cutoff." }
      ],
      grammarFocus: {
        title: "Reassurance Modals + Sequencing Imperatives",
        syntax: "Please be assured that + [Subject] + [Verb] ... First, [Imperative], Next, [Imperative], Finally, [Imperative].",
        bad: "Your account is locked because you typed wrong 3 times. Go check your mail.",
        good: "Please be assured your funds are secure. First, open the reset email. Next, create your new password."
      }
    },
    turns: [
      {
        turnNumber: 1,
        speaker: "Customer (Khun Somchai)",
        role: "caller",
        isStudent: false,
        audioPrompt: "Hello! I'm in a huge hurry right now. I've been trying to log into my merchant portal for the last 20 minutes to check today's payout, but it keeps saying 'Account Temporarily Locked'! I have clients waiting. Can you fix this immediately?",
        tone: "Hurried, worried about daily business payout",
        timeLimit: 20
      },
      {
        turnNumber: 2,
        speaker: "Student Agent",
        role: "agent",
        isStudent: true,
        timeLimit: 30,
        taskGoal: "Greet caller with calm empathy, apologize for the inconvenience, and politely verify full name and registered Merchant ID (MID).",
        hints: [
          "Empathy & Apology: 'Hello Khun Somchai. I completely understand how urgent this is for your business, and I deeply apologize for the inconvenience.'",
          "Reassurance: 'Please don't worry, I am here to help you regain access right away.'",
          "Verification: 'To get started, may I please verify your full name and registered Merchant ID for security purposes?'"
        ],
        modelResponse: "Hello Khun Somchai. I completely understand how urgent this is for your business, and I deeply apologize for the inconvenience. Please don't worry, I am here to help you regain access right away. To get started, may I please verify your full name and registered Merchant ID for security purposes?",
        modelAnalysis: "Warm, respectful, uses caller's name, delivers immediate reassurance, and performs secure credential verification."
      },
      {
        turnNumber: 3,
        speaker: "Customer (Khun Somchai)",
        role: "caller",
        isStudent: false,
        audioPrompt: "Okay, okay. My Merchant ID is MID-883920 and my name is Somchai Prasert. I tried entering my password three times, and then the error popped up. Is my money safe? What do I need to do now?",
        tone: "Relieved to be helped, provides MID-883920, anxious about fund safety",
        timeLimit: 25
      },
      {
        turnNumber: 4,
        speaker: "Student Agent",
        role: "agent",
        isStudent: true,
        timeLimit: 45,
        taskGoal: "Reassure fund safety, explain password recovery steps sequentially (First, Next, Finally), and ask for confirmation that the email reset was received.",
        hints: [
          "Fund Safety: 'Thank you for the verification, Khun Somchai. Please be assured that your account funds are completely secure; the temporary lock is an automated security feature to protect your portal.'",
          "Sequencing Steps: 'To restore access, first, please check your registered email inbox for an automated password reset link we just dispatched. Next, click the link and set a new password complying with our security criteria. Finally, log back in using your new credentials.'",
          "Verification: 'Could you please check your email now to confirm you have received it?'"
        ],
        modelResponse: "Thank you for the verification, Khun Somchai. Please be assured that your account funds are completely secure; the temporary lock is an automated security feature to protect your portal. To restore access, first, please check your registered email inbox for an automated password reset link we just dispatched. Next, click the link and set a new password complying with our standard security criteria. Finally, log back in using your new credentials. Could you please check your email now to confirm you have received it?",
        modelAnalysis: "Directly dissolves financial panic, frames security lock as a protective benefit, and delivers clear 3-step sequential instructions."
      }
    ],
    postTask: {
      modelDialogue: [
        { turn: 1, speaker: "Customer (Khun Somchai)", text: "Hello! I'm in a huge hurry right now. I've been trying to log into my merchant portal for the last 20 minutes to check today's payout, but it keeps saying 'Account Temporarily Locked'! I have clients waiting. Can you fix this immediately?", purpose: "Urgent merchant payout access disruption" },
        { turn: 2, speaker: "Agent", text: "Hello Khun Somchai. I completely understand how urgent this is for your business, and I deeply apologize for the inconvenience. Please don't worry, I am here to help you regain access right away. To get started, may I please verify your full name and registered Merchant ID for security purposes?", purpose: "Empathy + Apology + Polite Merchant ID Verification" },
        { turn: 3, speaker: "Customer (Khun Somchai)", text: "Okay, okay. My Merchant ID is MID-883920 and my name is Somchai Prasert. I tried entering my password three times, and then the error popped up. Is my money safe? What do I need to do now?", purpose: "Verification data provided + fund safety concern" },
        { turn: 4, speaker: "Agent", text: "Thank you for the verification, Khun Somchai. Please be assured that your account funds are completely secure; the temporary lock is an automated security feature to protect your portal. To restore access, first, please check your registered email inbox for an automated password reset link we just dispatched. Next, click the link and set a new password complying with our standard security criteria. Finally, log back in using your new credentials. Could you please check your email now to confirm you have received it?", purpose: "Fund Safety Assurance + Sequential Reset Instructions + Collaborative Follow-up" }
      ],
      languageFunctions: [
        { phrasing: "Please be assured that your account funds are completely secure...", function: "Financial Safety Reassurance", rationale: "Eliminates merchant panic regarding funds, stabilizing the customer relationship." },
        { phrasing: "The temporary lock is an automated security feature to protect your portal...", function: "Positive Reframing of Restriction", rationale: "Presents an inconvenient lockout as a proactive protective safeguard." },
        { phrasing: "First, please check... Next, click... Finally, log back in...", function: "Sequential Instruction Delivery", rationale: "Enables fast merchant self-service recovery with minimal friction." },
        { phrasing: "Could you please check your email now to confirm you have received it?", function: "Collaborative Verification", rationale: "Ensures email delivery before concluding the support session." }
      ],
      alternativeResponses: [
        {
          style: "Direct Support",
          turn2: "Sawadee krap Khun Somchai. I understand you need your payout details right away. May I verify your Merchant ID to unlock your portal?",
          turn4: "Your funds are 100% safe. I've sent a 1-click unlock link to your email. Click it, create a new password, and you'll be logged in within 30 seconds."
        },
        {
          style: "Corporate Relationship Manager",
          turn2: "Good day Khun Somchai. On behalf of Merchant Services, I apologize for this access interruption. Allow me to verify your Merchant ID so I can assist you.",
          turn4: "Rest assured your payout settlements are untouched. First, open the secure verification token dispatched to your inbox. Next, set your credentials. I will stay with you until you access your dashboard."
        }
      ],
      selfAssessmentChecklist: [
        "I greeted the merchant respectfully and apologized for the inconvenience in Turn 2.",
        "I verified full name and Merchant ID (MID-883920) before taking action.",
        "I explicitly reassured the merchant that their funds and payouts were secure in Turn 4.",
        "I used sequential transition markers (First, Next, Finally) to explain password recovery.",
        "I closed with a verification check to ensure the reset email arrived."
      ]
    },
    audioPrompt: "Hello! I'm in a huge hurry right now. I've been trying to log into my merchant portal for the last 20 minutes to check today's payout, but it keeps saying 'Account Temporarily Locked'! I have clients waiting. Can you fix this immediately?",
    taskGoal: "Greet caller with calm empathy, apologize for the inconvenience, and politely verify full name and registered Merchant ID (MID).",
    timeLimit: 30,
    checklist: [
      "I greeted merchant respectfully and verified credentials.",
      "I explicitly reassured the customer regarding fund safety.",
      "I provided sequential instructions with First, Next, Finally."
    ],
    hints: [
      "Empathy: 'I completely understand how urgent this is for your business.'",
      "Fund Safety: 'Please be assured that your account funds are completely secure.'"
    ],
    modelResponse: "Hello Khun Somchai. I completely understand how urgent this is for your business, and I deeply apologize for the inconvenience. Please don't worry, I am here to help you regain access right away. To get started, may I please verify your full name and registered Merchant ID for security purposes?"
  },

  8: {
    id: 8,
    unitId: "lesson_8",
    title: "Lesson 8: Integrated Support Process & Oral Case Summaries",
    shortTitle: "Integrated Process & Case Summaries",
    workplace: "Regional IT Support Desk (Global Enterprise SaaS)",
    callerName: "Sarah Davis (Regional Finance)",
    scenario: "Sarah Davis from Regional Finance is in a panic because she cannot log into the regional portal due to an MFA lockout, and has a quarterly report due in 20 minutes.",
    durationTotalMinutes: 150,
    isCapstone6Turn: true,
    preTask: {
      usefulExpressions: [
        {
          category: "Empathy Phrases",
          examples: [
            "I completely understand how frustrating this is, especially when you have an urgent deadline.",
            "I apologize for the inconvenience this is causing. Let's work together to get this sorted out right away.",
            "I can see why this is urgent for you. Rest assured, I am here to help you resolve this."
          ]
        },
        {
          category: "Probing & Diagnostics",
          examples: [
            "Could you please specify the exact error code or message appearing on your screen?",
            "May I confirm if this issue started occurring after the recent security update?",
            "Have you noticed if your colleagues in the same department are experiencing the same error?"
          ]
        },
        {
          category: "Sequencing & Action Instructions",
          examples: [
            "First, could you please close the active browser window?",
            "Next, let's try clearing the browser's cache and cookies by pressing Ctrl + Shift + Delete.",
            "After that, please click the secure MFA reset link I just dispatched to your corporate email.",
            "Finally, attempt to log back in and verify if the dashboard loads normally."
          ]
        },
        {
          category: "Ticket-to-Speech & Handover Markers",
          examples: [
            "Regarding Ticket ID #TK-4402, initial diagnostic checks confirmed...",
            "To date, Tier-1 has executed session unlock and dispatched an MFA token reset.",
            "The case is currently sitting at fully resolved status with dashboard operational.",
            "The required next step is for the incoming shift lead to monitor batch sync."
          ]
        }
      ],
      vocabulary: [
        { customerPhrase: "Huge panic / won't let me through", technicalTerm: "MFA Authentication Lockout", meaning: "Multi-factor authentication locked after exceeding 3 failed token submissions." },
        { customerPhrase: "Weird error / Error 401", technicalTerm: "HTTP 401 Unauthorized", meaning: "Security gateway rejected access token due to missing or invalid credentials." },
        { customerPhrase: "Updated security token and OTP", technicalTerm: "MFA Token Resynchronization", meaning: "Generating fresh one-time authentication pair to restore trusted device session." },
        { customerPhrase: "Ticket TK-4402", technicalTerm: "CRM Incident Reference Record", meaning: "Standardized record documenting root cause, resolution actions, and SLA compliance." }
      ],
      grammarFocus: {
        title: "5-Stage Shift Handover Framework & Modal Assurance",
        syntax: "Identification ('Regarding Ticket #TK-4402...') -> Symptom -> Actions Executed -> Current Status -> Next Steps / Closure.",
        bad: "She had an error and I fixed it. Now closing the call.",
        good: "Regarding Ticket #TK-4402, Tier-1 resolved an MFA lockout for Ms. Davis. The dashboard is operational and the case is closed."
      }
    },
    turns: [
      {
        turnNumber: 1,
        speaker: "Customer (Sarah Davis)",
        role: "caller",
        isStudent: false,
        audioPrompt: "Hi IT Support! I'm in a huge panic right now. I cannot log into the company's regional portal at all! The screen popped up with some weird error and won't let me through, and I have an urgent quarterly report due in 20 minutes! Can you fix this immediately?",
        tone: "Panicked, urgent, deadline pressure",
        timeLimit: 25
      },
      {
        turnNumber: 2,
        speaker: "Student Agent",
        role: "agent",
        isStudent: true,
        timeLimit: 45,
        taskGoal: "Acknowledge distress with immediate empathy, validate report urgency, and ask probing questions to extract the exact error message and user ID.",
        hints: [
          "Empathy: 'Hello Ms. Davis, I completely understand how critical this quarterly report is for you, and I apologize for the stress this access issue is causing.'",
          "Reassurance: 'Rest assured, I am here to help you get this sorted out right away.'",
          "Probing: 'To help me fix this quickly, could you please read the exact error message on your screen and confirm your user ID?'"
        ],
        modelResponse: "Hello Ms. Davis, I completely understand how critical this quarterly report is for you, and I apologize for the stress this access issue is causing. Rest assured, I am here to help you get this sorted out right away. To help me fix this quickly, could you please read the exact error message on your screen and confirm your user ID?",
        modelAnalysis: "De-escalates panic immediately and gathers diagnostic facts without making false promises."
      },
      {
        turnNumber: 3,
        speaker: "Customer (Sarah Davis)",
        role: "caller",
        isStudent: false,
        audioPrompt: "Thank you for being so patient. The message on the screen says 'Error 401: Invalid Credentials - Account Temporarily Locked after 3 Failed MFA Attempts'. But I am 100% positive I typed the correct password! I really need this unlocked right now!",
        tone: "Puzzled by MFA lockout, insistent on password correctness",
        timeLimit: 25
      },
      {
        turnNumber: 4,
        speaker: "Student Agent",
        role: "agent",
        isStudent: true,
        timeLimit: 60,
        taskGoal: "Reassure customer regarding account safety, explain temporary security lockout in plain English, and guide her step-by-step through the MFA reset procedure.",
        hints: [
          "De-jargonize & Reassure: 'Thank you for that information. It appears the system triggered a temporary security lockout following multiple authentication attempts. Don't worry, your account is perfectly safe.'",
          "Action Steps: 'I have just generated a secure MFA reset link and dispatched it directly to your corporate email. First, please open your inbox and click that link. Next, follow the prompt to verify your identity and enter the new one-time password.'",
          "Verification: 'Let me know as soon as you have submitted it.'"
        ],
        modelResponse: "Thank you for that information. It appears the system triggered a temporary security lockout following multiple authentication attempts. Don't worry, your account is perfectly safe. I have just generated a secure MFA reset link and dispatched it directly to your corporate email. First, please open your inbox and click that link. Next, follow the prompt to verify your identity and enter the new one-time password. Let me know as soon as you have submitted it.",
        modelAnalysis: "Translates technical lockout into safety reassurance and delivers actionable sequencing steps."
      },
      {
        turnNumber: 5,
        speaker: "Customer (Sarah Davis)",
        role: "caller",
        isStudent: false,
        audioPrompt: "Okay, I just clicked the reset link you sent, updated my security token, and entered the new OTP... and wow, it works! The portal dashboard is loading now. Thank you so much for your fast help!",
        tone: "Delighted, relieved, grateful",
        timeLimit: 20
      },
      {
        turnNumber: 6,
        speaker: "Student Agent",
        role: "agent",
        isStudent: true,
        timeLimit: 45,
        taskGoal: "Celebrate successful resolution, offer further assistance, provide Ticket ID #TK-4402 for tracking, and close the call with professional excellence.",
        hints: [
          "Confirm Resolution: 'That is wonderful news, Ms. Davis! I am glad to hear your dashboard is up and running.'",
          "Ticket Documentation: 'I have logged this incident under Ticket ID #TK-4402 and marked it as fully resolved.'",
          "Closing & Help: 'Is there anything else I can assist you with today? ... Excellent. Thank you for contacting IT Support, and best of luck with your quarterly report. Have a great day!'"
        ],
        modelResponse: "That is wonderful news, Ms. Davis! I am glad to hear your dashboard is up and running. I have logged this incident under Ticket ID #TK-4402 and marked it as fully resolved. Is there anything else I can assist you with today? ... Excellent. Thank you for contacting IT Support, and best of luck with your quarterly report. Have a great day!",
        modelAnalysis: "Complete call closure: professional rapport, audit-compliant ticket logging, and positive parting impression."
      }
    ],
    postTask: {
      modelDialogue: [
        { turn: 1, speaker: "Customer", text: "Hi IT Support! I'm in a huge panic right now. I cannot log into the company's regional portal at all! The screen popped up with some weird error and won't let me through, and I have an urgent quarterly report due in 20 minutes! Can you fix this immediately?", purpose: "Caller panic over portal lockout before deadline" },
        { turn: 2, speaker: "Support Agent", text: "Hello Ms. Davis, I completely understand how critical this quarterly report is for you, and I apologize for the stress this access issue is causing. Rest assured, I am here to help you get this sorted out right away. To help me fix this quickly, could you please read the exact error message on your screen and confirm your user ID?", purpose: "De-escalation & Information Gathering" },
        { turn: 3, speaker: "Customer", text: "Thank you for being so patient. The message on the screen says 'Error 401: Invalid Credentials - Account Temporarily Locked after 3 Failed MFA Attempts'. But I am 100% positive I typed the correct password! I really need this unlocked right now!", purpose: "Error 401 identification & MFA lock context" },
        { turn: 4, speaker: "Support Agent", text: "Thank you for that information. It appears the system triggered a temporary security lockout following multiple authentication attempts. Don't worry, your account is perfectly safe. I have just generated a secure MFA reset link and dispatched it directly to your corporate email. First, please open your inbox and click that link. Next, follow the prompt to verify your identity and enter the new one-time password. Let me know as soon as you have submitted it.", purpose: "Problem Diagnosis & Sequential Technical Instruction" },
        { turn: 5, speaker: "Customer", text: "Okay, I just clicked the reset link you sent, updated my security token, and entered the new OTP... and wow, it works! The portal dashboard is loading now. Thank you so much for your fast help!", purpose: "Successful resolution verification" },
        { turn: 6, speaker: "Support Agent", text: "That is wonderful news, Ms. Davis! I am glad to hear your dashboard is up and running. I have logged this incident under Ticket ID #TK-4402 and marked it as fully resolved. Is there anything else I can assist you with today? ... Excellent. Thank you for contacting IT Support, and best of luck with your quarterly report. Have a great day!", purpose: "Resolution Confirmation, Ticket Referencing & Professional Call Closure" }
      ],
      languageFunctions: [
        { phrasing: "Hello Ms. Davis, I completely understand how critical this report is...", function: "De-escalation & Active Listening", rationale: "Calms user urgency and sets supportive tone." },
        { phrasing: "It appears the system triggered a temporary security lockout...", function: "De-jargonizing Technical Glitch", rationale: "Explains authentication policy neutrally without blaming user error." },
        { phrasing: "First, open your inbox... Next, follow the prompt...", function: "Sequencing Guidance", rationale: "Prevents confusing multiple steps during MFA token reset." },
        { phrasing: "I have logged this incident under Ticket ID #TK-4402...", function: "Ticket Synthesis & QA Audit Compliance", rationale: "Ensures case history is documented for shift handover and SLA tracking." }
      ],
      alternativeResponses: [
        {
          style: "Direct Executive Support",
          turn2: "Ms. Davis, I see the urgency of your deadline. Let's resolve this immediately—what error is displayed?",
          turn4: "Your account is safe; it's a security lockout. I've sent a 1-click MFA override to your phone. Please click it now.",
          turn6: "Dashboard verified. Incident logged under #TK-4402. Good luck with your quarterly presentation!"
        },
        {
          style: "Standard Helpdesk Protocol",
          turn2: "Thank you for reaching IT Support. I apologize for the access inconvenience. May I verify your staff ID and error code?",
          turn4: "Thank you. To reset the security lock, please check your inbox for our automated reset link. I will stay on the line.",
          turn6: "Glad that resolved it. Case #TK-4402 is marked resolved. Thank you for calling IT Helpdesk."
        }
      ],
      selfAssessmentChecklist: [
        "I showed immediate empathy and validated the caller's quarterly report deadline in Turn 2.",
        "I explained the MFA security lockout in plain English without blaming the caller.",
        "I delivered clear sequential steps (First, Next) for the MFA reset link in Turn 4.",
        "I confirmed resolution and cited Ticket ID #TK-4402 in Turn 6.",
        "I delivered a professional closing with offer of further assistance."
      ]
    },
    audioPrompt: "Hi IT Support! I'm in a huge panic right now. I cannot log into the company's regional portal at all! The screen popped up with some weird error and won't let me through, and I have an urgent quarterly report due in 20 minutes! Can you fix this immediately?",
    taskGoal: "Acknowledge distress with immediate empathy, validate report urgency, and ask probing questions to extract the exact error message and user ID.",
    timeLimit: 45,
    checklist: [
      "I validated customer panic with calm empathy.",
      "I guided customer through sequential MFA reset.",
      "I cited Ticket ID #TK-4402 and delivered a professional closing."
    ],
    hints: [
      "Empathy: 'Hello Ms. Davis, I completely understand how critical this quarterly report is for you.'",
      "Resolution: 'I have logged this incident under Ticket ID #TK-4402 and marked it resolved.'"
    ],
    modelResponse: "Hello Ms. Davis, I completely understand how critical this quarterly report is for you, and I apologize for the stress this access issue is causing. Rest assured, I am here to help you get this sorted out right away. To help me fix this quickly, could you please read the exact error message on your screen and confirm your user ID?"
  }
};
