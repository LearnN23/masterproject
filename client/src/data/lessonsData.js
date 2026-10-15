/**
 * TECHQUEST: Master Curriculum Data (Lessons 1 to 8)
 * Authoritative EOP curriculum for IT Helpdesk & Customer Support
 * Sourced directly from Master's Thesis Curriculum Design & Lesson Plan deliverables
 */

export const LESSONS_DATA = {
  1: {
    id: 1,
    unitId: 'lesson_1',
    title: 'Responding to Customer Enquiries',
    shortTitle: 'Call Openings & Enquiries',
    focus: 'Professional greetings, offering help, showing empathy, and polite modal verbs',
    category: 'lesson',
    duration: '120 mins',
    company: 'International Tech Support Service Center (Malaysia)',
    googleSlidesUrl: 'https://docs.google.com/presentation/d/1rze2R49TDK2iXMq5g-eay6fe8dS9FxTUidVdWzVDTzw/edit?slide=id.p1#slide=id.p1',
    googleSlidesEmbedUrl: 'https://docs.google.com/presentation/d/1rze2R49TDK2iXMq5g-eay6fe8dS9FxTUidVdWzVDTzw/embed?start=false&loop=false&delayms=3000',
    situation: {
      role: 'Tier 1 Technical Support Specialist',
      illustrationType: 'desk_worker_female',
      intro: 'Imagine you are working as a Tier 1 Technical Support Agent. Your job involves receiving initial inquiries from customers who are experiencing technical issues with your company\'s software.',
      scenario: 'When a customer contacts you via chat or voice, the first few seconds are critical. You must establish a professional tone, show that you care about their problem, and politely ask for more details to diagnose the issue.',
      objectives: [
        'Use professional call opening greetings and state your identity.',
        'Offer help and acknowledge customer frustration with genuine empathy.',
        'Use polite modal verbs (could, would, may) to soften requests.',
        'Ask appropriate clarifying questions to gather initial error details.'
      ],
      workplaceMistake: {
        bad: {
          title: 'Ineffective Agent (Abrupt & Blunt)',
          quote: '"What is your problem? Give me your account number."',
          bullets: ['No greeting or agent identity', 'Demanding tone alienates caller', 'Lacks empathy for user frustration']
        },
        good: {
          title: 'Professional Agent (Warm & Reassuring)',
          quote: '"Thank you for contacting Technical Support. My name is Nadia. How may I assist you today?"',
          bullets: ['Professional corporate greeting', 'Clear personal identity', 'Immediate, courteous offer of help']
        }
      }
    },
    learn: {
      cards: [
        {
          title: '1. Professional Greetings',
          description: 'Always open with a standard, polite greeting and immediately offer assistance.',
          examples: [
            '"Thank you for contacting Technical Support. My name is Nadia."',
            '"How may I help you today?"',
            '"Good morning/afternoon, thank you for calling IT Helpdesk."'
          ],
          color: 'teal'
        },
        {
          title: '2. Showing Empathy',
          description: 'Acknowledge the customer\'s frustration professionally before jumping into technical steps.',
          examples: [
            '"I\'m sorry to hear that you are experiencing this issue."',
            '"I understand how frustrating it is when your system freezes."',
            '"Let me help you get this resolved right away."'
          ],
          color: 'indigo'
        }
      ],
      languageFocus: {
        title: 'Polite Modal Verbs (could, would, may)',
        explanation: 'Use modal verbs to soften requests. Direct imperatives ("Give me your ID", "Tell me your password") sound accusatory or aggressive in customer service.',
        badExamples: [
          '"What is your account number?"',
          '"Tell me the error code right now."',
          '"Repeat what you just said."'
        ],
        goodExamples: [
          '"Could you please provide your account number?"',
          '"Would you mind reading the error code to me?"',
          '"May I have your permission to access your screen?"'
        ]
      },
      modelDialogue: {
        title: 'Model Dialogue 1.1: Call Opening & Empathy',
        context: 'Customer contacts support because their accounting software crashed before saving.',
        lines: [
          { speaker: 'Agent (Nadia)', text: 'Thank you for calling Technical Support. My name is Nadia. How may I help you today?', purpose: 'Professional greeting & offer of help' },
          { speaker: 'Caller (Sarah)', text: 'Hi Nadia, my accounting portal just crashed and I was right in the middle of month-end reporting! I think I lost everything!', purpose: 'Customer expressing distress' },
          { speaker: 'Agent (Nadia)', text: 'I am so sorry to hear that, Sarah. I completely understand how stressful that must be with month-end deadlines. Rest assured, I will do my best to help you recover your data. Could you tell me what error message appeared before it closed?', purpose: 'Empathy + Reassurance + Polite modal request' },
          { speaker: 'Caller (Sarah)', text: 'It said "Memory Buffer Overflow Error 104".', purpose: 'Customer providing diagnostic fact' }
        ],
        keyTakeaways: [
          'Immediate empathy de-escalated customer panic before troubleshooting began.',
          'Modal verb "Could you tell me..." softened the request for error details.'
        ]
      }
    },
    practice: {
      title: 'Formative Practice',
      subtitle: 'Ungraded Learning Check',
      description: 'Practice identifying professional greetings and empathy statements. This activity is safe and ungraded.',
      questions: [
        {
          id: 'q1',
          prompt: 'A customer calls in saying: "My screen is completely frozen and I\'m losing all my work right now!" Which response shows the best professional empathy and modal usage?',
          options: [
            { id: 'A', text: '"You should have saved your work earlier. What is your username?"', isCorrect: false, feedback: 'Incorrect: This blames the customer and uses a blunt, demanding tone.' },
            { id: 'B', text: '"I\'m very sorry to hear that. I understand this is urgent, and I will help you right now. Could you please tell me which application froze?"', isCorrect: true, feedback: 'Correct! This validates the customer\'s feelings, offers immediate reassurance, and uses "Could you please..." for polite questioning.' },
            { id: 'C', text: '"Restart your computer and call back if it happens again."', isCorrect: false, feedback: 'Incorrect: Dismissive response with no empathy or diagnostic attempt.' }
          ]
        }
      ]
    },
    review: {
      title: 'Lesson 1 Review Quiz',
      passingScore: 2,
      questions: [
        {
          id: 'r1',
          question: 'Which of the following is the most professional way to request a customer\'s email address?',
          options: [
            { id: 'A', text: '"Give me your email address."', isCorrect: false },
            { id: 'B', text: '"Could you please provide your registered email address?"', isCorrect: true },
            { id: 'C', text: '"What is your email?"', isCorrect: false }
          ],
          explanation: '"Could you please provide..." uses modal politeness appropriate for international support.'
        },
        {
          id: 'r2',
          question: 'What are the three essential components of a standard contact center call opening?',
          options: [
            { id: 'A', text: 'Greeting, Agent Identity, and Offer of Help', isCorrect: true },
            { id: 'B', text: 'Greeting, Price Quote, and Problem Analysis', isCorrect: false },
            { id: 'C', text: 'Company Name, Hold Music, and Survey Reminder', isCorrect: false }
          ],
          explanation: 'Standard corporate greeting: Greeting + Agent Name + "How may I help you today?".'
        },
        {
          id: 'r3',
          question: 'When a customer expresses frustration about a software glitch, what should an agent do FIRST?',
          options: [
            { id: 'A', text: 'Tell the customer that software glitches are normal.', isCorrect: false },
            { id: 'B', text: 'Acknowledge the frustration with an empathetic statement.', isCorrect: true },
            { id: 'C', text: 'Transfer the call to a supervisor immediately.', isCorrect: false }
          ],
          explanation: 'Empathy must precede technical questioning to build rapport and trust.'
        }
      ]
    },
    speaking: {
      title: 'Simulated Speaking Challenge: Call Opening & Empathy',
      workplace: 'Tier-1 IT Service Desk — Helpdesk Audio Line',
      customerName: 'Marcus (Financial Analyst)',
      audioPrompt: 'Hello? I was working on an urgent report and my software just closed unexpectedly. I haven\'t saved in two hours! Can you help me get it back?',
      taskGoal: 'Formulate a 30–45 second spoken response. Greet the caller professionally, introduce yourself, express genuine empathy, reassure the caller, and use a polite modal verb to ask for the application name or error code.',
      timeLimit: 45,
      hints: [
        'Greeting: "Thank you for contacting Technical Support. My name is [Your Name]."',
        'Empathy: "I am so sorry to hear that your application closed unexpectedly."',
        'Reassurance: "I understand how urgent this report is, and I will help you right away."',
        'Modal Question: "Could you tell me which software program you were using when it closed?"'
      ],
      modelResponse: 'Thank you for contacting IT Technical Support. My name is Nadia. I am so sorry to hear that your application closed unexpectedly, Marcus. I completely understand how stressful that is when you have an urgent report due. Please rest assured that I will do everything I can to help you recover your file. Could you please tell me which program you were using, and did any error code appear before it shut down?',
      modelAnalysis: 'Begins with complete corporate greeting, uses caller\'s name, offers strong empathetic validation, and finishes with a polite modal diagnostic request.',
      checklist: [
        'I stated a professional greeting and introduced my name.',
        'I expressed clear empathy and reassured the caller.',
        'I used a polite modal verb (could/would/may) to ask for error details.'
      ]
    }
  },

  2: {
    id: 2,
    unitId: 'lesson_2',
    title: 'Identifying and Clarifying Technical Problems',
    shortTitle: 'Clarifying Problems',
    focus: '3-stage diagnostic funnel, indirect diagnostic questions, and reflective paraphrasing',
    category: 'lesson',
    duration: '150 mins',
    company: 'Concentrix Malaysia (JA003) & Evoxt (JA014) — Cyberjaya',
    situation: {
      role: 'Tier 1 Diagnostic Support Specialist',
      illustrationType: 'desk_worker_male',
      intro: 'In Malaysian technical helpdesks and BPO centers, frontline agents must isolate technical faults quickly and accurately.',
      scenario: 'Customers often describe problems using vague language ("My app isn\'t working", "The cloud panel is broken"). Support specialists need structured diagnostic questioning skills to identify whether an issue is caused by account credentials, software glitches, network connectivity, or hardware errors before attempting troubleshooting.',
      objectives: [
        'Differentiate between open-ended diagnostic questions and closed confirmation questions.',
        'Construct indirect diagnostic questions ("Could you tell me what error message appears?") to isolate technical faults politely.',
        'Paraphrase and confirm vague customer statements using reflective check structures ("So if I understand correctly...").',
        'Perform a diagnostic clarification spoken response to isolate authentication or network faults.'
      ],
      workplaceMistake: {
        bad: {
          title: 'Ineffective Agent (Rapid Interrogation)',
          quote: '"What error? What browser? Is your Wi-Fi on? Did you change your password?"',
          bullets: ['Rapid-fire interrogation overwhelms caller', 'Sounds accusatory and impatient', 'Jumps to conclusions without listening']
        },
        good: {
          title: 'Professional Agent (3-Stage Diagnostic Funnel)',
          quote: '"Could you tell me what happens when you click login? ... So if I understand correctly, the app spins and shows Error 504 on Wi-Fi, is that right?"',
          bullets: ['Open Funnel gathers broad context', 'Narrow Probe isolates specific technical parameters', 'Reflective Paraphrasing verifies mutual alignment']
        }
      }
    },
    learn: {
      cards: [
        {
          title: '1. The 3-Stage Diagnostic Funnel',
          description: 'Isolate faults systematically from broad symptom to precise technical fact.',
          examples: [
            'Stage 1 (Open Funnel): "Could you describe what happens when you launch the application?"',
            'Stage 2 (Narrow Probe): "Would you mind specifying whether you are on Wi-Fi or cellular data?"',
            'Stage 3 (Paraphrase & Confirm): "So if I understand correctly, the app crashes upon clicking submit; is that right?"'
          ],
          color: 'blue'
        },
        {
          title: '2. Reflective Paraphrasing',
          description: 'Summarize the customer\'s problem in clear technical terms with a confirmation tag.',
          examples: [
            '"So if I understand correctly, [summarized symptom], is that right?"',
            '"Just to confirm, you are able to sign in, but the dashboard fails to load?"',
            '"To make sure I have this right, this problem only occurs when connecting via VPN?"'
          ],
          color: 'indigo'
        }
      ],
      languageFocus: {
        title: 'Indirect Diagnostic Questions (Grammar & Word Order)',
        explanation: 'In indirect questions, the clause following the polite starter uses STATEMENT word order (Subject + Verb), NOT question word order.',
        badExamples: [
          'x "Could you tell me what is the error code?" (Inverted word order)',
          'x "Would you mind telling me why did the app freeze?" (Do-auxiliary in indirect clause)',
          'x "Tell me where is your router located." (Direct imperative)'
        ],
        goodExamples: [
          '✓ "Could you tell me what the error code is?" (Correct statement order: Subject + Verb)',
          '✓ "Would you mind telling me why the app froze?" (Past tense statement order)',
          '✓ "Could you tell me where your router is located?"'
        ]
      },
      modelDialogue: {
        title: 'Model Dialogue 2.1: Fault Isolation (Mobile App)',
        context: 'Customer Mr. Roy calls Concentrix technical support reporting that mobile banking is broken.',
        lines: [
          { speaker: 'Agent (Maya)', text: 'Thank you for calling Concentrix Technical Support. My name is Maya. How may I assist you today?', purpose: 'Call opening & offer of help' },
          { speaker: 'Caller (Mr. Roy)', text: 'Hi! Your mobile banking app is completely useless! I tried logging in to transfer money, but it won\'t let me in!', purpose: 'Vague customer complaint' },
          { speaker: 'Agent (Maya)', text: 'I am sorry to hear that you are having trouble logging in, Mr. Roy. I can certainly help you troubleshoot this right now. Could you tell me what happens when you tap the login button?', purpose: 'Empathy + Stage 1 Open Funnel Question' },
          { speaker: 'Caller (Mr. Roy)', text: 'Well, I type my password, the screen spins, and then a message pops up saying "Authentication Timeout Code 504".', purpose: 'Customer reveals specific error code' },
          { speaker: 'Agent (Maya)', text: 'Thank you for specifying that error code. Would you mind telling me if you are connected via Wi-Fi or cellular mobile data?', purpose: 'Stage 2 Narrow Probe (Network Isolation)' },
          { speaker: 'Caller (Mr. Roy)', text: 'I\'m currently connected to my home Wi-Fi network.', purpose: 'Narrowing down environment' },
          { speaker: 'Agent (Maya)', text: 'Understood. So if I understand correctly, your app displays an "Authentication Timeout 504" error while connected to your home Wi-Fi; is that right?', purpose: 'Stage 3 Reflective Paraphrase & Confirmation' },
          { speaker: 'Caller (Mr. Roy)', text: 'Yes, exactly! That is what happens.', purpose: 'Mutual confirmation achieved' }
        ],
        keyTakeaways: [
          'Maya elicited error 504 and home Wi-Fi without arguing or sounding accusatory.',
          'The 3-stage funnel brought the call from vague anger to an actionable technical diagnosis.'
        ]
      }
    },
    practice: {
      title: 'Formative Practice',
      subtitle: 'Diagnostic Questions & Paraphrasing Check',
      description: 'Practice formulating indirect diagnostic questions and reflective paraphrasing.',
      questions: [
        {
          id: 'q1',
          prompt: 'An agent wants to know if a customer\'s router lights are illuminated. Which indirect question is most grammatically and pragmatically correct?',
          options: [
            { id: 'A', text: '"Could you tell me if the router lights are illuminated?"', isCorrect: true, feedback: 'Correct! Uses statement word order ("the router lights are...") following the indirect polite starter.' },
            { id: 'B', text: '"Could you tell me are the router lights illuminated?"', isCorrect: false, feedback: 'Incorrect: Uses inverted question word order ("are the router lights...") inside the indirect clause.' },
            { id: 'C', text: '"Tell me what lights are on router right now."', isCorrect: false, feedback: 'Incorrect: Overly direct and grammatically incomplete.' }
          ]
        },
        {
          id: 'q2',
          prompt: 'Customer: "I clicked \'Submit Order\', but the screen went white and no receipt came to my email." Which reflective paraphrase is most professional?',
          options: [
            { id: 'A', text: '"Your computer probably has a virus."', isCorrect: false, feedback: 'Incorrect: Unsubstantiated diagnostic claim that alarms the customer.' },
            { id: 'B', text: '"So if I understand correctly, the transaction processed, but the page became unresponsive before displaying an invoice; is that right?"', isCorrect: true, feedback: 'Correct! Accurately restates the symptom in professional technical terms and includes a confirmation tag.' },
            { id: 'C', text: '"Give me your order number right now."', isCorrect: false, feedback: 'Incorrect: Ignores the customer\'s explanation.' }
          ]
        }
      ]
    },
    review: {
      title: 'Lesson 2 Review Quiz',
      passingScore: 2,
      questions: [
        {
          id: 'r1',
          question: 'Which sentence has the correct indirect question word order?',
          options: [
            { id: 'A', text: '"Could you tell me where is the database server hosted?"', isCorrect: false },
            { id: 'B', text: '"Could you tell me where the database server is hosted?"', isCorrect: true },
            { id: 'C', text: '"Could you tell me where does the database server host?"', isCorrect: false }
          ],
          explanation: 'Indirect clauses require statement order: "where [the database server] [is hosted]".'
        },
        {
          id: 'r2',
          question: 'When should an agent use "whether" instead of "if" in an indirect diagnostic question?',
          options: [
            { id: 'A', text: 'When asking about the weather outside.', isCorrect: false },
            { id: 'B', text: 'When offering a choice between two specific alternatives (e.g. Wi-Fi vs mobile data, Chrome vs Edge).', isCorrect: true },
            { id: 'C', text: 'Only when speaking to an internal manager.', isCorrect: false }
          ],
          explanation: '"Whether" is formally preferred when clarifying between two alternatives.'
        },
        {
          id: 'r3',
          question: 'What is the primary objective of Stage 3 (Reflective Paraphrasing) in the diagnostic funnel?',
          options: [
            { id: 'A', text: 'To prolong the call duration to meet KPI targets.', isCorrect: false },
            { id: 'B', text: 'To verify mutual understanding of the exact technical fault before starting troubleshooting.', isCorrect: true },
            { id: 'C', text: 'To convince the customer that the fault is their own fault.', isCorrect: false }
          ],
          explanation: 'Paraphrasing prevents wasting handling time on incorrect diagnoses.'
        }
      ]
    },
    speaking: {
      title: 'Simulated Speaking Challenge: Diagnostic Clarification',
      workplace: 'Evoxt Sdn Bhd (JA014) — Cloud Hosting Support Desk',
      customerName: 'Enterprise Client',
      audioPrompt: 'Hi, helpdesk! I\'m trying to access my cloud panel, but my browser just says "Page Cannot Be Displayed". This is blocking my work!',
      taskGoal: 'Formulate a 30–45 second diagnostic clarification response. Acknowledge the issue calmly, ask an indirect question about whether they are connected via office VPN, ask what numeric error code appears, and paraphrase to confirm understanding.',
      timeLimit: 45,
      hints: [
        'Empathy: "I understand how frustrating it is to be blocked from your control panel."',
        'VPN Probe: "Could you tell me if you are currently connected through the office VPN network?"',
        'Error Code: "Would you mind specifying whether any numeric error code displays when you refresh?"',
        'Paraphrase: "So if I understand correctly, the panel fails to load while you are on your office connection; is that right?"'
      ],
      modelResponse: 'I understand how frustrating it is to be blocked from your control panel. I can certainly help you troubleshoot this right now. Could you tell me if you are currently connected through the office VPN network? Also, would you mind specifying whether any numeric error code displays when you refresh the page? So if I understand correctly, the page fails to load completely on your browser; is that right?',
      modelAnalysis: 'Demonstrates calm empathy, uses two grammatically correct indirect diagnostic questions, and finishes with a clear reflective confirmation tag.',
      checklist: [
        'I acknowledged the user\'s issue with calm empathy.',
        'I used "Could you tell me if..." or "Would you mind specifying..." with correct word order.',
        'I included a reflective paraphrasing check ("So if I understand correctly...").'
      ]
    }
  },

  3: {
    id: 3,
    unitId: 'lesson_3',
    title: 'Explaining Troubleshooting Procedures',
    shortTitle: 'Troubleshooting Procedures',
    focus: 'First conditional for cause-and-effect, sequencing transitions, and proposing workarounds',
    category: 'lesson',
    duration: '150 mins',
    company: 'Scicom (MSC) Berhad (JA020) — Application Support Desk',
    situation: {
      role: 'Application Support Desk Specialist',
      illustrationType: 'desk_worker_female',
      intro: 'When technical faults occur in SaaS platforms or e-commerce systems, users need clear explanations of what is happening and step-by-step guidance to apply workarounds.',
      scenario: 'Merchants and corporate users often become anxious when core systems glitch. Support engineers must explain technical cause-and-effect relationships without confusing jargon, propose logical workarounds, and guide the user through corrective action using conditional structures.',
      objectives: [
        'Analyze customer error symptoms and classify them into hardware, software, cache, or network faults.',
        'Construct First Conditional sentences ("If you clear your browser cache, the portal will load correctly") to explain cause and effect.',
        'Sequence troubleshooting steps logically using transition markers (First, Next, Subsequently, Once that is done).',
        'Deliver a spoken troubleshooting explanation and workaround proposal to resolve an e-commerce checkout error.'
      ],
      workplaceMistake: {
        bad: {
          title: 'Ineffective Agent (Jargon-Heavy & Blaming)',
          quote: '"Your DOM renderer has a cookie deadlock. If you don\'t mess with the cache, it won\'t break."',
          bullets: ['Confuses caller with opaque technical jargon', 'Accuses customer of breaking their own system', 'Provides zero actionable guidance']
        },
        good: {
          title: 'Professional Agent (Cause-and-Effect with First Conditional)',
          quote: '"This glitch occurs because old browser cookies are blocking the payment script. If you clear your browser cache and refresh, the gateway will load properly."',
          bullets: ['Translates technical cause into plain English', 'Uses First Conditional to show exact benefit of workaround', 'Maintains reassuring, collaborative partnership']
        }
      }
    },
    learn: {
      cards: [
        {
          title: '1. First Conditional for Troubleshooting',
          description: 'Explain clear cause-and-effect workarounds: If + Present Simple, will + Base Verb.',
          examples: [
            '"If you clear your browser cache, the portal will load correctly."',
            '"If the error persists after rebooting, we will reset your access token."',
            '"If you disconnect the VPN, the local printer will become visible."'
          ],
          color: 'emerald'
        },
        {
          title: '2. Softening Troubleshooting Advice',
          description: 'Frame troubleshooting as collaborative recommendations rather than forceful commands.',
          examples: [
            '"What I recommend doing first is clearing your temporary internet files."',
            '"To resolve this glitch, we can try running the app in an Incognito window."',
            '"Let\'s test this quick workaround together."'
          ],
          color: 'blue'
        }
      ],
      languageFocus: {
        title: 'Troubleshooting Conditionals & Sequencing Syntax',
        explanation: 'Avoid using "will" in the if-clause. The condition takes present simple, and the result takes "will".',
        badExamples: [
          'x "If you will reset the router, the connection will restore." (Double will error)',
          'x "If you clearing the cache, it work." (Broken verb forms)',
          'x "You must do this or it fail." (Aggressive modal)'
        ],
        goodExamples: [
          '✓ "If you reset the router, the connection will restore." (Present simple + will)',
          '✓ "If you clear the cache and refresh, the script will execute properly."',
          '✓ "Once that is done, we will verify the transaction log together."'
        ]
      },
      modelDialogue: {
        title: 'Model Dialogue 3.1: E-Commerce Admin Crash Workaround',
        context: 'An online store owner calls Scicom support because inventory export crashes the portal.',
        lines: [
          { speaker: 'Agent (Danial)', text: 'Thank you for calling Application Support. My name is Danial. How may I assist you today?', purpose: 'Call opening' },
          { speaker: 'Caller (Brenda)', text: 'Danial, every time I click "Export Inventory to CSV", the screen turns grey and crashes! I need to ship orders now!', purpose: 'Critical business issue' },
          { speaker: 'Agent (Danial)', text: 'I understand how critical that export is for your shipping workflow, Brenda. This crash happens because the export batch size exceeds your browser\'s memory limit. What I recommend doing is filtering the export by product category. If you export the data in smaller batches of 500 items, the portal will process the CSV smoothly without crashing.', purpose: 'Empathy + Cause explanation + First Conditional workaround' },
          { speaker: 'Caller (Brenda)', text: 'Oh, I see! Let me select "Category: Electronics" first and try exporting again.', purpose: 'Customer following workaround' },
          { speaker: 'Agent (Danial)', text: 'Perfect. While you do that, I will stay on the line. If any error appears during the download, we will generate the file directly from our server console.', purpose: 'Supportive conditional reassurance' }
        ],
        keyTakeaways: [
          'Agent Danial explained why the crash occurred without using confusing memory leak jargon.',
          'Used First Conditional to clearly illustrate the outcome of filtering data.'
        ]
      }
    },
    practice: {
      title: 'Formative Practice',
      subtitle: 'Conditionals & Cause-and-Effect Workarounds',
      description: 'Practice constructing First Conditional sentences for troubleshooting scenarios.',
      questions: [
        {
          id: 'q1',
          prompt: 'Select the grammatically correct First Conditional sentence for a troubleshooting workaround:',
          options: [
            { id: 'A', text: '"If you will reset the router, the connection will restore."', isCorrect: false, feedback: 'Incorrect: "Will" should not appear inside the if-clause.' },
            { id: 'B', text: '"If you reset the router, the connection will restore."', isCorrect: true, feedback: 'Correct! "If + present simple (reset), ... will + base verb (will restore)".' },
            { id: 'C', text: '"If you resetting router, connection restored."', isCorrect: false, feedback: 'Incorrect: Missing auxiliary verbs and broken syntax.' }
          ]
        },
        {
          id: 'q2',
          prompt: 'A customer says: "Why should I clear my cache? That sounds like a waste of time." How should you explain the cause-and-effect?',
          options: [
            { id: 'A', text: '"Because company policy says you have to do it."', isCorrect: false, feedback: 'Incorrect: Authoritarian and unhelpful.' },
            { id: 'B', text: '"When browsers store outdated script files, they can conflict with our newest update. If you clear the cache, your browser will load the fresh code and resolve the button freeze."', isCorrect: true, feedback: 'Correct! Clear technical cause-and-effect explained in accessible English.' },
            { id: 'C', text: '"If you don\'t do it, your computer will stay broken forever."', isCorrect: false, feedback: 'Incorrect: Exaggerated and unprofessional.' }
          ]
        }
      ]
    },
    review: {
      title: 'Lesson 3 Review Quiz',
      passingScore: 2,
      questions: [
        {
          id: 'r1',
          question: 'In the sentence "If you _____ the application, the changes _____ effect immediately," which verb pair is correct?',
          options: [
            { id: 'A', text: 'restart / will take', isCorrect: true },
            { id: 'B', text: 'will restart / will take', isCorrect: false },
            { id: 'C', text: 'restarted / takes', isCorrect: false }
          ],
          explanation: 'First Conditional rule: If + present simple (restart), result will + base verb (will take).'
        },
        {
          id: 'r2',
          question: 'Which of the following expressions is best for introducing a troubleshooting recommendation gently?',
          options: [
            { id: 'A', text: '"You have no choice but to..."', isCorrect: false },
            { id: 'B', text: '"What I recommend doing to resolve this is..."', isCorrect: true },
            { id: 'C', text: '"Do this immediately:"', isCorrect: false }
          ],
          explanation: '"What I recommend doing is..." softens advice into a collaborative action.'
        },
        {
          id: 'r3',
          question: 'What is the primary role of sequential transition words (First, Next, Once that is done) in troubleshooting?',
          options: [
            { id: 'A', text: 'To guide the customer through complex multi-step technical procedures without confusion.', isCorrect: true },
            { id: 'B', text: 'To prove that the agent is a native speaker.', isCorrect: false },
            { id: 'C', text: 'To fill silence while the server is loading.', isCorrect: false }
          ],
          explanation: 'Sequential markers provide structure and pacing so users do not get lost.'
        }
      ]
    },
    speaking: {
      title: 'Simulated Speaking Challenge: Troubleshooting Workaround',
      workplace: 'Scicom Application Support — Merchant Helpdesk',
      customerName: 'E-Commerce Store Owner',
      audioPrompt: 'Hi! My customers are complaining that when they click "Pay Now" on my store website, nothing happens! I\'m losing sales!',
      taskGoal: 'Formulate a 35–45 second troubleshooting spoken response. Empathize with the lost sales urgency, explain the cause (cached gateway scripts), propose clearing the browser cache using the First Conditional, and reassure them with a secondary workaround.',
      timeLimit: 45,
      hints: [
        'Empathy: "I completely understand how critical this payment issue is for your business sales."',
        'Cause: "This glitch typically happens because outdated browser cache blocks the checkout script."',
        'First Conditional: "If you clear your browser cache and refresh the store, the payment gateway will initialize properly."',
        'Reassurance: "If the button still does not respond, I will immediately reset your checkout API connection."'
      ],
      modelResponse: 'I completely understand how critical this payment button issue is for your business, and I will help you fix this immediately. This glitch typically occurs because outdated browser cache is blocking the checkout script. If you clear your browser cache and refresh the portal, the payment gateway will initialize properly. Let\'s try that right now, and if the button still does not respond, I will immediately reset your checkout API connection.',
      modelAnalysis: 'Combines urgent empathy, clear non-jargon explanation of the technical cause, flawless First Conditional syntax, and a reassuring fallback plan.',
      checklist: [
        'I empathized with the customer\'s business impact.',
        'I explained the technical cause clearly in plain English.',
        'I used a correct First Conditional structure ("If you..., the system will...").'
      ]
    }
  },

  4: {
    id: 4,
    unitId: 'lesson_4',
    title: 'Handling Customer Complaints',
    shortTitle: 'Handling Complaints',
    focus: 'The HEAR framework, professional apologies without admitting liability, and de-escalation',
    category: 'lesson',
    duration: '120 mins',
    company: 'Teleperformance Malaysia (JA004) — Complaint Management Unit',
    situation: {
      role: 'Customer Resolution Specialist',
      illustrationType: 'desk_worker_male',
      intro: 'In contact centers like Teleperformance Malaysia, handling irate callers disputing duplicate charges, service outages, or delayed orders is a core daily duty.',
      scenario: 'When customers are furious, attempting to argue, interrupt, or cite company rules only escalates their anger. Professional agents apply the HEAR framework (Hear, Empathize, Apologize, Resolve) to de-escalate tension, validate the client\'s emotional state, and regain control of the call constructively.',
      objectives: [
        'Identify and critique defensive or dismissive agent responses versus empathetic de-escalating language.',
        'Apply the 4-stage HEAR framework (Hear actively, Empathize, Apologize professionally, Resolve with ownership).',
        'Formulate sincere corporate apologies without accepting personal or legal liability.',
        'Deliver a spoken de-escalation response to calm an irate caller disputing a double billing charge.'
      ],
      workplaceMistake: {
        bad: {
          title: 'Ineffective Agent (Defensive & Combative)',
          quote: '"Sir, calm down and stop yelling! Our billing system doesn\'t make mistakes. You probably pressed submit twice."',
          bullets: ['Commands customer to "calm down" (guaranteed escalation)', 'Defends system instead of validating customer experience', 'Blames user directly, triggering official complaints']
        },
        good: {
          title: 'Professional Agent (HEAR Framework & Personal Ownership)',
          quote: '"I completely understand how concerning a duplicate charge is on your statement, and I sincerely apologize for this frustration. Rest assured that I am taking personal ownership of this right now."',
          bullets: ['Validates financial anxiety immediately', 'Offers sincere corporate apology without legal blame', 'Takes personal ownership to build confidence and calm']
        }
      }
    },
    learn: {
      cards: [
        {
          title: '1. The HEAR De-escalation Model',
          description: 'A proven 4-stage psychological model for resolving emotionally charged customer complaints.',
          examples: [
            'H - Hear Actively: Listen without interrupting; let them release their initial anger.',
            'E - Empathize: "I completely understand why this situation is so frustrating for you."',
            'A - Apologize: "I sincerely apologize for the inconvenience and delay this has caused."',
            'R - Resolve: "Rest assured, I am personally taking ownership of your case right now."'
          ],
          color: 'rose'
        },
        {
          title: '2. Professional Apologies vs Legal Liability',
          description: 'Apologize for the customer\'s inconvenience and emotional distress without making unverified legal admissions.',
          examples: [
            'Safe & Professional: "I sincerely apologize for the frustration this billing discrepancy has caused."',
            'Unsafe / High Risk: "Our accounting software is totally broken and our company messed up your account."',
            'Action-Oriented: "Let me investigate your billing ledger immediately to make this right."'
          ],
          color: 'amber'
        }
      ],
      languageFocus: {
        title: 'De-escalation Language & Empathy Anchors',
        explanation: 'Avoid fighting words like "You have to...", "Calm down", or "That\'s company policy". Use reassuring anchors of personal accountability.',
        badExamples: [
          'x "You need to calm down or I will hang up."',
          'x "That is our policy, there is nothing I can do."',
          'x "It\'s not my fault, the bank processed it."'
        ],
        goodExamples: [
          '✓ "I completely understand how concerning this is, and I am here to help you."',
          '✓ "Rest assured that I will stay on this call until we have resolved this."',
          '✓ "I will personally oversee your refund request today."'
        ]
      },
      modelDialogue: {
        title: 'Model Dialogue 4.1: Duplicate Credit Card Charge',
        context: 'Customer Mr. Tan calls Teleperformance shouting about being billed twice for software.',
        lines: [
          { speaker: 'Caller (Mr. Tan)', text: 'I just checked my credit card bill and you charged me TWICE for my monthly subscription! Your billing system is a disaster! I want my money back right now or I\'m calling my lawyer!', purpose: 'Irate customer outburst' },
          { speaker: 'Agent (Kevin)', text: 'I completely understand how concerning a duplicate charge is on your credit card statement, Mr. Tan, and I sincerely apologize for the frustration this has caused you.', purpose: 'Hear + Empathize + Sincere Apology' },
          { speaker: 'Caller (Mr. Tan)', text: 'Well... it\'s $99! That is not a small amount of money!', purpose: 'Customer tone beginning to soften' },
          { speaker: 'Agent (Kevin)', text: 'You are absolutely right, Mr. Tan. Rest assured that I am taking personal ownership of this issue right now. May I verify your account email address so I can access your transaction history and process an immediate refund?', purpose: 'Validation + Ownership + Action step' },
          { speaker: 'Caller (Mr. Tan)', text: 'Yes, fine. It\'s tan.business@gmail.com.', purpose: 'Customer de-escalated and cooperating' }
        ],
        keyTakeaways: [
          'Agent Kevin did not tell Mr. Tan to calm down or defend the software.',
          'By using "I completely understand..." and "taking personal ownership", Kevin turned conflict into cooperation.'
        ]
      }
    },
    practice: {
      title: 'Formative Practice',
      subtitle: 'De-escalation Phrases & Conflict Resolution',
      description: 'Practice choosing de-escalating language when handling angry complaints.',
      questions: [
        {
          id: 'q1',
          prompt: 'A caller is shouting about an emergency order that arrived 5 days late. Which response is most effective for de-escalating the situation?',
          options: [
            { id: 'A', text: '"Sir, you need to lower your voice or I will disconnect this call."', isCorrect: false, feedback: 'Incorrect: Threatening disconnection accelerates anger.' },
            { id: 'B', text: '"I completely understand how frustrating this delay is, especially for an urgent order, and I sincerely apologize for the inconvenience. Let me look into this right now."', isCorrect: true, feedback: 'Correct! Validates the customer\'s urgency, apologizes sincerely, and moves immediately into resolution.' },
            { id: 'C', text: '"The courier company is responsible for shipments, not us."', isCorrect: false, feedback: 'Incorrect: Deflecting blame to a third party destroys customer trust.' }
          ]
        }
      ]
    },
    review: {
      title: 'Lesson 4 Review Quiz',
      passingScore: 2,
      questions: [
        {
          id: 'r1',
          question: 'What do the letters in the HEAR de-escalation framework represent?',
          options: [
            { id: 'A', text: 'Hear, Empathize, Apologize, Resolve', isCorrect: true },
            { id: 'B', text: 'Hold, Explain, Argue, Record', isCorrect: false },
            { id: 'C', text: 'Help, Escalate, Ask, Report', isCorrect: false }
          ],
          explanation: 'HEAR stands for Hear actively, Empathize, Apologize professionally, and Resolve with ownership.'
        },
        {
          id: 'r2',
          question: 'Why should contact center agents avoid saying "You need to calm down" to an angry caller?',
          options: [
            { id: 'A', text: 'Because telling someone to calm down invalidates their emotion and almost always increases their anger.', isCorrect: true },
            { id: 'B', text: 'Because it is too long to say.', isCorrect: false },
            { id: 'C', text: 'Because callers are always right.', isCorrect: false }
          ],
          explanation: 'Telling someone to calm down is perceived as patronizing and escalates conflict.'
        },
        {
          id: 'r3',
          question: 'Which of the following phrases expresses personal ownership of a customer complaint?',
          options: [
            { id: 'A', text: '"I will pass your complaint to the complaints department."', isCorrect: false },
            { id: 'B', text: '"Rest assured, I am taking personal ownership of your issue and will see it through to resolution."', isCorrect: true },
            { id: 'C', text: '"Our terms of service explain why this happened."', isCorrect: false }
          ],
          explanation: '"Rest assured, I am taking personal ownership..." provides maximum psychological reassurance.'
        }
      ]
    },
    speaking: {
      title: 'Simulated Speaking Challenge: De-escalating Billing Outburst',
      workplace: 'Teleperformance Malaysia — Customer Retention Queue',
      customerName: 'Frustrated Subscriber',
      audioPrompt: 'I just checked my credit card bill and you charged me TWICE for my monthly subscription! Your billing system is a disaster!',
      taskGoal: 'Formulate a 30–45 second de-escalation spoken response. Acknowledge their anger without being defensive, apologize sincerely for the duplicate billing frustration, take personal ownership, and explain the concrete refund investigation steps.',
      timeLimit: 45,
      hints: [
        'Empathy: "I completely understand how concerning a duplicate charge is on your statement."',
        'Apology: "I sincerely apologize for this billing error and the frustration it has caused."',
        'Ownership: "Rest assured that I am taking personal ownership of this right now."',
        'Action: "I will immediately review your transaction ledger, void the duplicate payment, and ensure the refund is issued."'
      ],
      modelResponse: 'I completely understand how concerning a duplicate charge is on your credit card statement, and I sincerely apologize for this billing error. Rest assured that I am taking personal ownership of this issue right now. I will immediately review your transaction ledger, void the duplicate payment of $49, and ensure the refund is processed back to your card within 24 to 48 hours.',
      modelAnalysis: 'Begins with empathetic validation, delivers a clean corporate apology without defensiveness, and assumes direct personal ownership to calm the caller.',
      checklist: [
        'I validated the customer\'s concern without arguing or commanding them to calm down.',
        'I offered a sincere professional apology for their frustration.',
        'I stated clear personal ownership of the resolution steps.'
      ]
    }
  },

  5: {
    id: 5,
    unitId: 'lesson_5',
    title: 'Providing Clear Instructions',
    shortTitle: 'Giving Instructions',
    focus: 'Imperative verbs, sequential transition markers, and non-patronizing comprehension checks',
    category: 'lesson',
    duration: '120 mins',
    company: 'BASF (Malaysia) Sdn. Bhd. (JA010) & iFAST — Cyberjaya IT Helpdesk',
    situation: {
      role: 'IT Helpdesk Specialist',
      illustrationType: 'desk_worker_female',
      intro: 'Guiding corporate employees or retail investors through multi-step software configurations (such as MFA setup, password resets, or VPN installations) is a fundamental duty.',
      scenario: 'Non-technical callers easily get lost when given too many steps at once or when agents use vague directions ("click on that thing on the left"). Frontline IT specialists must use clear imperative verbs, sequence steps using logical transition markers, and perform polite comprehension checks before moving forward.',
      objectives: [
        'Apply imperative verbs (click, select, enter, toggle, verify) paired with sequential transitions (first, next, subsequently, finally).',
        'Break down complex IT processes into bite-sized 1-to-2 step instructional chunks.',
        'Construct polite comprehension checks ("Does that dialog box appear on your screen?") without sounding patronizing.',
        'Deliver a step-by-step spoken instruction guide to help a user update their account security settings.'
      ],
      workplaceMistake: {
        bad: {
          title: 'Ineffective Agent (Overloaded & Patronizing)',
          quote: '"Click settings, then go to preferences, then network, then toggle IPv6 off and restart. Do you understand or is that too hard?"',
          bullets: ['Overwhelms caller with 5 simultaneous steps', 'Uses patronizing check ("is that too hard?")', 'Leaves caller confused and anxious']
        },
        good: {
          title: 'Professional Agent (Sequenced & Validated)',
          quote: '"First, click on \'My Profile\' at the top right. Next, select \'Contact Preferences\'. Does that menu appear on your display?"',
          bullets: ['Paces instructions into 2 manageable actions', 'Sequenced with "First" and "Next"', 'Uses polite, objective comprehension check']
        }
      }
    },
    learn: {
      cards: [
        {
          title: '1. Imperatives & Sequential Markers',
          description: 'Structure multi-step technical instructions clearly using chronological transition words.',
          examples: [
            '"First, click on the Settings gear icon in the top right corner."',
            '"Next, select \'Security & Authentication\' from the left sidebar."',
            '"Subsequently, enter the 6-digit verification code sent to your phone."',
            '"Finally, click \'Save Changes\' to complete your setup."'
          ],
          color: 'indigo'
        },
        {
          title: '2. Non-Patronizing Comprehension Checks',
          description: 'Check progress by asking about screen elements rather than asking if the user is smart enough to understand.',
          examples: [
            'Polite & Objective: "Does the \'Network Properties\' dialog box appear on your screen?"',
            'Polite & Objective: "Were you able to locate the blue \'Submit\' button?"',
            'Avoid Patronizing: "Do you understand what I said?" or "Are you following me?"'
          ],
          color: 'teal'
        }
      ],
      languageFocus: {
        title: 'Instructional Chunking & Pacing',
        explanation: 'Give a maximum of two action verbs per instruction, followed by an observational check. Never string four commands into one run-on sentence.',
        badExamples: [
          'x "Open control panel, find adapter settings, right click wifi, choose properties, and hit uncheck." (Cognitive overload)',
          'x "You should probably maybe try to click that icon." (Hesitant, lacks authority)'
        ],
        goodExamples: [
          '✓ "First, open your Network Settings. Next, select \'Change Adapter Options\'."',
          '✓ "Please let me know once that window opens on your display."',
          '✓ "Once that is done, we will proceed to the next step together."'
        ]
      },
      modelDialogue: {
        title: 'Model Dialogue 5.1: Multi-Factor Authentication (MFA) Setup',
        context: 'Agent assists an employee at BASF Malaysia with enrolling in Microsoft Authenticator.',
        lines: [
          { speaker: 'Agent (Aina)', text: 'Thank you for calling IT Helpdesk. My name is Aina. How may I assist you today?', purpose: 'Call opening' },
          { speaker: 'Caller (Hassan)', text: 'Hi Aina, I just got a company mobile phone and I need help setting up my MFA login for office email.', purpose: 'Request for multi-step guidance' },
          { speaker: 'Agent (Aina)', text: 'I would be happy to guide you through that setup, Hassan. First, on your computer, please open your browser and navigate to portal.office.com. Next, enter your company email address. Does the login page appear on your screen?', purpose: 'Chunked instructions + Objective check' },
          { speaker: 'Caller (Hassan)', text: 'Yes, it is prompting me for my password now.', purpose: 'Customer confirmation' },
          { speaker: 'Agent (Aina)', text: 'Excellent. Please enter your temporary password. Once that is done, a prompt saying "More Information Required" will appear. Please click the blue "Next" button.', purpose: 'Next step with sequential transition' }
        ],
        keyTakeaways: [
          'Agent Aina chunked the setup into pairs of actions.',
          'Used observational checks ("Does the login page appear?") so the caller felt supported, not tested.'
        ]
      }
    },
    practice: {
      title: 'Formative Practice',
      subtitle: 'Instruction Sequencing & Comprehension Checks',
      description: 'Practice formulating clear imperative commands and polite comprehension checks.',
      questions: [
        {
          id: 'q1',
          prompt: 'An agent wants to verify if a caller is looking at the correct settings page. Which question is most effective and professional?',
          options: [
            { id: 'A', text: '"You understand what I said?"', isCorrect: false, feedback: 'Incorrect: Patronizing and can make callers defensive.' },
            { id: 'B', text: '"Does the \'Network Properties\' dialog box appear on your display?"', isCorrect: true, feedback: 'Correct! Objective, observational check that verifies screen state without questioning intelligence.' },
            { id: 'C', text: '"Why haven\'t you clicked the button yet?"', isCorrect: false, feedback: 'Incorrect: Impatient and rude.' }
          ]
        }
      ]
    },
    review: {
      title: 'Lesson 5 Review Quiz',
      passingScore: 2,
      questions: [
        {
          id: 'r1',
          question: 'What verb form is used when giving direct technical instructions in English?',
          options: [
            { id: 'A', text: 'Imperative base form (e.g., Click, Select, Enter, Toggle)', isCorrect: true },
            { id: 'B', text: 'Present continuous (e.g., Clicking, Selecting)', isCorrect: false },
            { id: 'C', text: 'Past participle (e.g., Clicked, Selected)', isCorrect: false }
          ],
          explanation: 'Technical instructions use base-form imperatives: "Click Save", "Select Network".'
        },
        {
          id: 'r2',
          question: 'What is the recommended maximum number of instructional actions an agent should give before checking progress?',
          options: [
            { id: 'A', text: '1 to 2 actions', isCorrect: true },
            { id: 'B', text: '5 to 7 actions', isCorrect: false },
            { id: 'C', text: 'As many as possible to save time', isCorrect: false }
          ],
          explanation: 'Limiting to 1–2 actions prevents cognitive overload and reduces misunderstandings.'
        },
        {
          id: 'r3',
          question: 'Which sequence of transition markers flows most logically for a 3-step technical guide?',
          options: [
            { id: 'A', text: 'First... Next... Finally...', isCorrect: true },
            { id: 'B', text: 'Finally... Then... First...', isCorrect: false },
            { id: 'C', text: 'Immediately... Suddenly... Eventually...', isCorrect: false }
          ],
          explanation: '"First", "Next", and "Finally" represent standard chronological transition markers.'
        }
      ]
    },
    speaking: {
      title: 'Simulated Speaking Challenge: Guiding Profile Settings',
      workplace: 'iFAST Global Support Desk — Customer Portal Assistance',
      customerName: 'Investor Client',
      audioPrompt: 'Hi! I\'m logged into my iFAST investor account, but I can\'t figure out where to update my primary email address.',
      taskGoal: 'Formulate a 30–45 second spoken instructional response. Guide the caller step-by-step to update their profile email using sequential transition markers (First, Next, Once that is done), imperative verbs, and a polite comprehension check.',
      timeLimit: 45,
      hints: [
        'First step: "First, click on \'My Profile\' at the top right of your portal screen."',
        'Second step: "Next, select \'Contact Preferences\' from the dropdown menu."',
        'Check: "Does that submenu appear on your display?"',
        'Final step: "Once that is done, enter your new email address and click \'Save Changes\'."'
      ],
      modelResponse: 'I would be glad to guide you through updating your email address. First, please click on \'My Profile\' at the top right of your portal screen. Next, select \'Contact Preferences\' from the dropdown menu. Does that submenu appear on your display? Great. Once that page opens, enter your new address in the primary field and select \'Save Changes\'. You will then receive a confirmation link in your inbox.',
      modelAnalysis: 'Chunks instructions into clear pairs of actions, uses chronological transitions (First, Next, Once that is done), and includes an objective screen check.',
      checklist: [
        'I used imperative action verbs (click, select, enter).',
        'I sequenced my steps using markers like "First", "Next", and "Once that is done".',
        'I checked progress using an observational screen check.'
      ]
    }
  },

  6: {
    id: 6,
    unitId: 'lesson_6',
    title: 'Escalating Unresolved Issues',
    shortTitle: 'Escalating Cases',
    focus: 'SLA priority tiers, warm escalation handovers, and managing customer expectations',
    category: 'lesson',
    duration: '120 mins',
    company: 'Accenture Malaysia (JA013) — Level-1 Service Desk',
    situation: {
      role: 'Level-1 Technical Support Specialist',
      illustrationType: 'desk_worker_male',
      intro: 'Not all technical incidents can be resolved at Tier-1. Major database outages, server exceptions, and critical security issues must be escalated.',
      scenario: 'When Tier-1 agents encounter issues beyond their scope, dumping the call or saying "I can\'t help you" creates severe customer frustration. Professional agents explain the valid technical reason for escalation, classify the SLA priority (P1 Critical vs P2 High), create a reference ticket, and set clear expectations for when Tier-2 will respond.',
      objectives: [
        'Identify SLA priority levels (P1 Critical, P2 High, P3 Standard) and escalation triggers.',
        'Construct professional escalation explanations ("Due to the backend database nature of this error, I am escalating your case...").',
        'Set clear expectations by providing a Ticket Reference ID and SLA callback timeline.',
        'Deliver a spoken warm escalation response during a critical business payroll failure.'
      ],
      workplaceMistake: {
        bad: {
          title: 'Ineffective Agent (Cold Dump & Helplessness)',
          quote: '"I don\'t know how to fix server bugs. That\'s not my job. Call Tier-2 or submit another ticket."',
          bullets: ['Exhibits total helplessness and damages company reputation', 'Fails to assign ticket priority or reference number', 'Leaves caller with zero timeline or expectation']
        },
        good: {
          title: 'Professional Agent (Warm Escalation & Reassurance)',
          quote: '"Due to the server-side database nature of this error, I am escalating your case immediately to our Tier-2 Systems team as a Priority 1 Critical ticket. Your Ticket ID is #TK-9821, and an engineer will contact you within 30 minutes."',
          bullets: ['Explains valid technical rationale for transfer', 'Assigns P1 priority and explicit ticket tracking code', 'Commits to concrete SLA timeline (30 mins)']
        }
      }
    },
    learn: {
      cards: [
        {
          title: '1. The 4 Components of a Warm Escalation',
          description: 'Ensure customers feel supported and confident when their issue is transferred internally.',
          examples: [
            '1. Valid Technical Reason: "Due to the backend server permissions required..."',
            '2. Destination & Priority: "I am escalating your ticket to our Senior Engineering team as Priority 1."',
            '3. Ticket ID: "Your reference ticket number is #TK-9821."',
            '4. SLA Callback Timeline: "A senior engineer will contact you within 30 minutes."'
          ],
          color: 'amber'
        },
        {
          title: '2. SLA Priority Classification',
          description: 'Accurately align customer impact with corporate Service Level Agreements.',
          examples: [
            'P1 (Critical): Total business stoppage, entire office offline, core payment gateway down (SLA: 15–30 min response).',
            'P2 (High): Major department impacted, significant workaround required (SLA: 1–2 hours).',
            'P3 (Standard): Single user glitch, general administrative request (SLA: 4–8 hours).'
          ],
          color: 'rose'
        }
      ],
      languageFocus: {
        title: 'Escalation Transition Markers',
        explanation: 'Use professional transition formulas that frame the escalation as an upgrade in technical support rather than an agent failure.',
        badExamples: [
          'x "I don\'t know what to do so I\'m transferring you."',
          'x "Our tier-1 team isn\'t trained for this."',
          'x "You will have to wait until someone feels like calling you."'
        ],
        goodExamples: [
          '✓ "To ensure this is resolved safely, I am involving our Senior Database Specialists."',
          '✓ "Because this requires direct server-level privileges, I am escalating your case immediately."',
          '✓ "I have personally flagged this ticket as Urgent in our Tier-2 queue."'
        ]
      },
      modelDialogue: {
        title: 'Model Dialogue 6.1: Escalating a P1 Payroll Outage',
        context: 'HR Manager calls Accenture Service Desk because the payroll database froze during staff payouts.',
        lines: [
          { speaker: 'Agent (Zack)', text: 'Thank you for calling IT Service Desk. My name is Zack. How may I assist you today?', purpose: 'Call opening' },
          { speaker: 'Caller (Datin Linda)', text: 'Zack, our automated payroll run failed halfway through executing monthly staff salaries! 500 employees haven\'t been paid! This is a complete business emergency!', purpose: 'P1 Business emergency' },
          { speaker: 'Agent (Zack)', text: 'I completely understand the critical urgency of this situation, Datin Linda. Because this involves a core database synchronization failure that requires root server access, I am escalating your case immediately to our Tier-2 Senior Systems Engineering team as a Priority 1 Critical incident.', purpose: 'Empathy + Valid reason + P1 designation' },
          { speaker: 'Caller (Datin Linda)', text: 'How quickly will someone get back to me? We have banks waiting!', purpose: 'Customer requesting timeline' },
          { speaker: 'Agent (Zack)', text: 'I have logged this under Ticket ID #TK-9821. Under our P1 SLA, a senior systems engineer will review the incident logs and contact you directly within 30 minutes. I am also paging the on-duty duty manager right now.', purpose: 'Ticket ID + 30-min SLA commitment + Active paging' }
        ],
        keyTakeaways: [
          'Agent Zack treated the emergency with appropriate gravity and urgency.',
          'Provided Ticket ID and 30-minute SLA callback commitment to reassure the client.'
        ]
      }
    },
    practice: {
      title: 'Formative Practice',
      subtitle: 'Escalation Reasons & SLA Commitments',
      description: 'Practice formulating professional escalation explanations and managing timelines.',
      questions: [
        {
          id: 'q1',
          prompt: 'An agent needs to escalate a complex firewall routing bug to Tier-2. Which statement is most professional?',
          options: [
            { id: 'A', text: '"I don\'t know how firewalls work, so I\'m giving your call to someone else."', isCorrect: false, feedback: 'Incorrect: Displays incompetence and diminishes customer confidence.' },
            { id: 'B', text: '"Due to the network security protocols involved, I am escalating your ticket to our Senior Infrastructure Engineers as a Priority 2 request."', isCorrect: true, feedback: 'Correct! Explains the valid technical reason and frames the transfer professionally.' },
            { id: 'C', text: '"Tier-2 might call you next week if they are not busy."', isCorrect: false, feedback: 'Incorrect: Vague, unprofessional, and breaches SLA standards.' }
          ]
        }
      ]
    },
    review: {
      title: 'Lesson 6 Review Quiz',
      passingScore: 2,
      questions: [
        {
          id: 'r1',
          question: 'What are the four essential pieces of information an agent must provide during a warm escalation?',
          options: [
            { id: 'A', text: 'Valid technical reason, Destination/Priority, Ticket Reference ID, and SLA callback timeline', isCorrect: true },
            { id: 'B', text: 'Agent\'s personal phone number, manager\'s home address, password, and warranty', isCorrect: false },
            { id: 'C', text: 'Credit card number, apology letter, survey link, and discount coupon', isCorrect: false }
          ],
          explanation: 'Reason + Priority + Ticket ID + SLA timeline form the standard BPO escalation framework.'
        },
        {
          id: 'r2',
          question: 'Which scenario represents a Priority 1 (Critical) incident?',
          options: [
            { id: 'A', text: 'A single user forgot their desktop screensaver password.', isCorrect: false },
            { id: 'B', text: 'The entire corporate ERP database is offline during month-end payroll execution.', isCorrect: true },
            { id: 'C', text: 'A team member wants to request a new wireless mouse.', isCorrect: false }
          ],
          explanation: 'P1 incidents involve total service outage or massive core business disruption.'
        },
        {
          id: 'r3',
          question: 'Why should an agent avoid promising: "A senior engineer will definitely fix your bug in 5 minutes"?',
          options: [
            { id: 'A', text: 'Because Tier-1 cannot predict the exact resolution time of complex backend bugs, and false promises violate SLA integrity.', isCorrect: true },
            { id: 'B', text: 'Because Tier-2 engineers don\'t like working fast.', isCorrect: false },
            { id: 'C', text: 'Because customer support should always be slow.', isCorrect: false }
          ],
          explanation: 'Agents should commit to the SLA response time (when they will call), NOT guarantee resolution time.'
        }
      ]
    },
    speaking: {
      title: 'Simulated Speaking Challenge: Escalating Payroll Emergency',
      workplace: 'Accenture Level-1 Helpdesk — Critical Incident Desk',
      customerName: 'HR Director',
      audioPrompt: 'Helpdesk? Our payroll software failed right in the middle of executing monthly staff payments! This is a critical business emergency!',
      taskGoal: 'Formulate a 35–45 second warm escalation response. Validate the critical urgency, explain the valid technical rationale for Tier-2 transfer (database synchronization), assign P1 Priority with a ticket ID, and commit to a 30-minute SLA response timeline.',
      timeLimit: 45,
      hints: [
        'Urgency: "I completely understand the critical urgency of this payroll issue, sir."',
        'Technical Reason: "Due to the server-side database nature of this error, I am escalating your case immediately to our Senior Systems Engineering team."',
        'Priority & ID: "I have flagged this as a Priority 1 Critical incident under Ticket ID #TK-9821."',
        'SLA: "A senior engineer will review the incident logs and contact you directly within 30 minutes."'
      ],
      modelResponse: 'I completely understand the critical urgency of this payroll issue, sir. Because this involves a server-side database synchronization fault that requires direct database admin rights, I am escalating your case immediately to our Tier-2 Senior Systems Engineering team as a Priority 1 Critical ticket. I have created Ticket ID #TK-9821 and flagged it as an active business emergency. A senior engineer will review the server logs and contact you directly within 30 minutes. Rest assured we are prioritizing this until payroll execution is restored.',
      modelAnalysis: 'Balances urgent empathy, provides a legitimate technical justification for the transfer, cites an exact tracking number, and establishes a firm SLA callback commitment.',
      checklist: [
        'I treated the situation with appropriate gravity and empathy.',
        'I stated a valid technical reason for escalating to Tier-2.',
        'I provided a Ticket ID and an SLA callback timeline (within 30 minutes).'
      ]
    }
  },

  7: {
    id: 7,
    unitId: 'lesson_7',
    title: 'Support Tickets and Technical Documentation',
    shortTitle: 'Ticket Hygiene & Records',
    focus: '5-field CRM ticket hygiene, past-tense diagnostic verbs, and objective factual summaries',
    category: 'lesson',
    duration: '120 mins',
    company: 'Credspire Support / BASF Shared Service Center (JA010)',
    situation: {
      role: 'Technical Documentation & Support Specialist',
      illustrationType: 'desk_worker_female',
      intro: 'In global IT operations, support tickets in CRM databases (Salesforce, Zendesk, ServiceNow) serve as legal audit trails and operational handovers.',
      scenario: 'Vague ticket notes ("helped user, fixed it") lead to repeated troubleshooting, missed SLAs, and failed audits. Professional agents document every case using a standardized 5-field schema (Subject, Symptom, Root Cause, Action Taken, Resolution) written with precise past-tense diagnostic verbs.',
      objectives: [
        'Master core contact center acronyms (SLA, FCR, AHT, TAT, CSAT, CRM) in professional context.',
        'Apply the standard 5-field CRM ticket anatomy (Subject, Symptom, Root Cause, Action Taken, Resolution).',
        'Use standardized past-tense technical action verbs (Verified, Isolated, Guided, Reconfigured, Resolved).',
        'Deliver a spoken oral ticket briefing summarizing a resolved technical support case.'
      ],
      workplaceMistake: {
        bad: {
          title: 'Ineffective Agent (Sloppy & Subjective)',
          quote: '"Subject: user called. Notes: user was annoying, vpn didn\'t work, told her what to do, ticket closed."',
          bullets: ['Includes subjective, emotional bias against customer', 'Omits error code, IP configuration, and root cause', 'Useless for quality audits or subsequent shifts']
        },
        good: {
          title: 'Professional Agent (Structured 5-Field Hygiene)',
          quote: '"Subject: [VPN Gateway] Error Code 102. Action Taken: Verified employee credentials, isolated DNS conflict on home router, guided user through DNS flush. Resolution: RESOLVED. FCR achieved."',
          bullets: ['Structured 5-field documentation format', 'Objective past-tense action verbs', 'Complies with BPO quality audits and SLA metrics']
        }
      }
    },
    learn: {
      cards: [
        {
          title: '1. The 5-Field CRM Ticket Anatomy',
          description: 'The industry-standard structure for documenting technical support cases.',
          examples: [
            '1. Subject: [Category] Concise description of problem',
            '2. Symptom: User reported specific error code or behavior',
            '3. Root Cause: Technical fault isolated by agent',
            '4. Action Taken: Numbered past-tense steps performed',
            '5. Resolution / Status: RESOLVED (FCR Achieved) / ESCALATED'
          ],
          color: 'blue'
        },
        {
          title: '2. Past-Tense Diagnostic Verbs',
          description: 'Always use concise, professional past-tense action verbs in case logs.',
          examples: [
            'Verified credentials (ID #M-9021)',
            'Isolated network latency to local gateway DNS',
            'Guided user through router re-configuration',
            'Dispatched password reset token via email',
            'Resolved incident with confirmed server connectivity'
          ],
          color: 'emerald'
        }
      ],
      languageFocus: {
        title: 'BPO Operational Acronyms',
        explanation: 'Understand the metrics and acronyms used in technical support operations.',
        badExamples: [
          'x "We need to fix this fast because boss is watching." (Unprofessional)',
          'x "The ticket took too many minutes." (Imprecise)'
        ],
        goodExamples: [
          '✓ FCR (First Contact Resolution): Resolving the issue on the initial interaction without callbacks.',
          '✓ SLA (Service Level Agreement): The contractual timeframe for response or resolution.',
          '✓ AHT (Average Handling Time): Total duration of call plus post-call ticket wrap-up.',
          '✓ CSAT (Customer Satisfaction Score): The customer rating of the interaction.'
        ]
      },
      modelDialogue: {
        title: 'Model Dialogue 7.1: Quality Assurance Ticket Audit',
        context: 'QA Coach reviews Ticket #TK-3091 with support agent Golf at Credspire Support.',
        lines: [
          { speaker: 'QA Coach', text: 'Golf, let\'s examine your ticket notes for the merchant portal account lockout call. What did you write in the Action Taken field?', purpose: 'Audit review' },
          { speaker: 'Agent (Golf)', text: 'I wrote: "1. Verified merchant ID #M-9021. 2. Isolated 3 consecutive failed login attempts triggering automated security lockout. 3. Dispatched reset link to registered email. 4. Confirmed user regained portal access."', purpose: 'Clean past-tense documentation' },
          { speaker: 'QA Coach', text: 'Excellent! You used precise past-tense verbs (Verified, Isolated, Dispatched, Confirmed) and avoided subjective commentary. That achieves 100% on ticket hygiene audit.', purpose: 'Positive QA evaluation' }
        ],
        keyTakeaways: [
          'Every action line begins with a strong past-tense verb.',
          'No emotional commentary; only objective technical facts and verified resolution.'
        ]
      }
    },
    practice: {
      title: 'Formative Practice',
      subtitle: 'Ticket Hygiene & Acronym Identification',
      description: 'Practice identifying contact center metrics and standardizing ticket entries.',
      questions: [
        {
          id: 'q1',
          prompt: 'What does FCR stand for in contact center operations?',
          options: [
            { id: 'A', text: 'First Contact Resolution', isCorrect: true, feedback: 'Correct! FCR measures the percentage of customer issues resolved completely on the very first interaction.' },
            { id: 'B', text: 'Fast Customer Response', isCorrect: false, feedback: 'Incorrect.' },
            { id: 'C', text: 'Final Case Report', isCorrect: false, feedback: 'Incorrect.' }
          ]
        },
        {
          id: 'q2',
          prompt: 'Which sentence uses professional, objective past-tense verbs suitable for a CRM ticket log?',
          options: [
            { id: 'A', text: '"Customer was stubborn and didn\'t want to click the button."', isCorrect: false, feedback: 'Incorrect: Subjective and unprofessional commentary.' },
            { id: 'B', text: '"Verified employee credentials, guided user through clearing DNS cache, and confirmed successful reconnection to corporate VPN."', isCorrect: true, feedback: 'Correct! Uses standardized past-tense verbs (Verified, Guided, Confirmed) in an objective manner.' },
            { id: 'C', text: '"We fixed it yesterday and it works now."', isCorrect: false, feedback: 'Incorrect: Too vague for audit compliance.' }
          ]
        }
      ]
    },
    review: {
      title: 'Lesson 7 Review Quiz',
      passingScore: 2,
      questions: [
        {
          id: 'r1',
          question: 'What are the five core fields of a professional CRM support ticket record?',
          options: [
            { id: 'A', text: 'Subject, Symptom, Root Cause, Action Taken, and Resolution/Status', isCorrect: true },
            { id: 'B', text: 'Name, Hobby, Opinion, Weather, and Rating', isCorrect: false },
            { id: 'C', text: 'Greeting, Invoice, Credit Score, Hold Music, and Survey', isCorrect: false }
          ],
          explanation: 'Subject, Symptom, Cause, Action Taken, Resolution form the universal 5-field schema.'
        },
        {
          id: 'r2',
          question: 'Why must support agents strictly avoid writing subjective comments (e.g., "caller was clueless") in CRM ticket notes?',
          options: [
            { id: 'A', text: 'Because ticket logs are legal audit records and can be subpoenaed or viewed by clients during quality reviews.', isCorrect: true },
            { id: 'B', text: 'Because ticket fields only allow numbers.', isCorrect: false },
            { id: 'C', text: 'Because CRM software automatically deletes tickets with adjectives.', isCorrect: false }
          ],
          explanation: 'Tickets are legal business records; subjective notes breach corporate compliance standards.'
        },
        {
          id: 'r3',
          question: 'Which metric measures the total duration of a customer call plus the time required to complete the post-call ticket documentation?',
          options: [
            { id: 'A', text: 'AHT (Average Handling Time)', isCorrect: true },
            { id: 'B', text: 'CSAT (Customer Satisfaction Score)', isCorrect: false },
            { id: 'C', text: 'SLA (Service Level Agreement)', isCorrect: false }
          ],
          explanation: 'Average Handling Time (AHT) = Talk Time + Hold Time + After-Call Work (Wrap-up).'
        }
      ]
    },
    speaking: {
      title: 'Simulated Speaking Challenge: Oral Ticket Case Summary',
      workplace: 'BASF Shared Service Center — Voice Documentation Archive',
      customerName: 'Sarah Lim (Logistics Corp)',
      audioPrompt: 'Helpdesk, this is Sarah Lim from Logistics Corp. I need an official status confirmation on my VPN connection error Code 102. Can you brief me on what was done?',
      taskGoal: 'Formulate a 35–45 second oral case summary for the CRM voice archive. State Ticket ID #TK-5541, summarize the symptom (Gateway Unreachable), state root cause (router DNS conflict), outline actions taken with past-tense verbs, and state confirmed resolution.',
      timeLimit: 45,
      hints: [
        'ID & Priority: "I am briefing you on Ticket ID #TK-5541, Priority 2 for Corporate VPN Network."',
        'Symptom & Cause: "The user reported Gateway Unreachable Code 102, caused by local router DNS resolution conflicts."',
        'Actions Taken: "Tier-1 verified employee credentials, guided the user through reconfiguring DNS settings, and executed a DNS flush."',
        'Resolution: "VPN connectivity re-established successfully, access to servers was verified, and the ticket is now Resolved with FCR achieved."'
      ],
      modelResponse: 'Good day, Sarah. I am briefing you on Ticket ID #TK-5541, logged as a Priority 2 high-impact connectivity issue for Corporate VPN Network. The user reported Gateway Unreachable Code 102 when connecting via home Wi-Fi. Diagnostic investigation isolated the root cause to home router DNS resolution blocking the corporate VPN gateway. Tier-1 guided the user through reconfiguring DNS settings and executing a local DNS cache flush. The VPN connection re-established successfully, access to internal servers was verified, and the ticket is now marked Resolved with First Contact Resolution achieved.',
      modelAnalysis: 'Structures case facts following the 5-field schema, incorporates past-tense diagnostic verbs (isolated, guided, executed, re-established), and cites key BPO metrics (Priority 2, FCR achieved).',
      checklist: [
        'I stated the Ticket ID and Priority level.',
        'I used professional past-tense verbs (isolated, guided, verified, resolved).',
        'I confirmed that First Contact Resolution (FCR) was achieved.'
      ]
    }
  },

  8: {
    id: 8,
    unitId: 'lesson_8',
    title: 'Complete Online Customer Support Interaction',
    shortTitle: 'Integrated Shift Handover (Capstone)',
    focus: '5-stage handover framework, oral case synthesis, and comprehensive support interaction',
    category: 'lesson',
    duration: '240 mins',
    company: 'Scicom (MSC) Berhad (JA020) & BASF Malaysia (JA010)',
    situation: {
      role: 'Senior Technical Support Lead (Outgoing Morning Shift)',
      illustrationType: 'desk_worker_male',
      intro: 'In 24/7 global BPO centers, shift changes require seamless oral handovers. When one team rotates off and the next rotates on, outgoing leads must brief incoming leads on critical ongoing incidents.',
      scenario: 'This capstone unit synthesizes all skills from Lessons 1 through 7: call openings, diagnostic funnels, conditional troubleshooting workarounds, de-escalation empathy, clear instructions, escalation protocols, and ticket documentation into a structured 5-stage Oral Case Summary.',
      objectives: [
        'Synthesize complex multi-turn ticket histories into essential diagnostic facts without reading raw logs.',
        'Structure a 5-stage oral case summary following the BPO shift handover framework.',
        'Apply precise operational transition markers (*"I am briefing you on...", "Initial checks confirmed...", "currently sitting at...", "The required next step is..."*).',
        'Deliver a polished 60–75 second oral shift handover summary for Ticket #TK-4402.'
      ],
      workplaceMistake: {
        bad: {
          title: 'Ineffective Agent (Disorganized & Rambling)',
          quote: '"Um, yeah, this guy called about MFA, I sent him some link, not sure if he clicked it, his ticket is somewhere in the backlog, check it if you have time."',
          bullets: ['Omits Ticket ID, Priority, and Account name', 'Fails to specify whether user is pending or resolved', 'Leaves incoming shift with zero SLA deadline or action item']
        },
        good: {
          title: 'Professional Agent (5-Stage Structured Handover)',
          quote: '"Good afternoon. I am briefing you on Ticket ID #TK-4402, Priority 3 for Scicom SaaS Portal. Account lockout triggered by failed MFA. Verified credentials and dispatched reset link. Status is Pending User Action. Required next step is for the afternoon desk to verify login logs before 01:00 PM SLA window."',
          bullets: ['All 5 stages covered chronologically in 60 seconds', 'Exact ticket status and SLA target defined', 'Zero ambiguity for incoming shift engineers']
        }
      }
    },
    learn: {
      cards: [
        {
          title: '1. The 5-Stage Shift Handover Framework',
          description: 'The golden standard framework for oral case briefings during contact center shift rotations.',
          examples: [
            'Stage 1 (Case Overview): Ticket ID, Priority, Account ("I am briefing you on Ticket ID #TK-4402, Priority 3...")',
            'Stage 2 (Symptom Statement): Core problem clause ("Client reported an automated account lockout following failed MFA...")',
            'Stage 3 (Diagnostic Actions Taken): Past-tense summary ("Initial checks confirmed credentials, and Tier-1 dispatched reset link...")',
            'Stage 4 (Current Ticket Status): ("Currently sitting at Pending User Action status...")',
            'Stage 5 (Oncoming Action & SLA Deadline): ("Required next step is to verify login log in CRM prior to 01:00 PM SLA...")'
          ],
          color: 'teal'
        },
        {
          title: '2. Professional Transition Markers',
          description: 'Keep your oral briefing structured and concise with transitional signals.',
          examples: [
            '"I am briefing you on Ticket ID #..." (Opening)',
            '"Initial checks confirmed that..." (Diagnostic actions)',
            '"The ticket is currently sitting at... status" (Status)',
            '"The required next step for the oncoming desk is..." (Action item)',
            '"...prior to the [Time] SLA window." (Deadline)'
          ],
          color: 'indigo'
        }
      ],
      languageFocus: {
        title: 'Synthesizing vs Verbatim Reading',
        explanation: 'Do NOT read customer chat transcripts word-for-word during a handover. Synthesize raw details into high-level diagnostic facts.',
        badExamples: [
          'x "And then the customer said \'hello, my name is John, how are you today\', and I said \'I am good\'..." (Reading transcript verbatim)',
          'x "I don\'t know what happened before my shift." (Lack of accountability)'
        ],
        goodExamples: [
          '✓ "The customer reported an automated MFA lockout following three failed login attempts."',
          '✓ "Tier-1 dispatched an automated password reset link and monitored the session token."'
        ]
      },
      modelDialogue: {
        title: 'Model Dialogue 8.1: Morning-to-Afternoon Shift Handover',
        context: 'Outgoing lead Nadia briefs incoming afternoon lead Vikram at Scicom Cyberjaya.',
        lines: [
          { speaker: 'Vikram (Incoming Lead)', text: 'Hi Nadia, good job on the morning queue. What critical tickets do you have for the afternoon handover?', purpose: 'Handover opening' },
          { speaker: 'Nadia (Outgoing Lead)', text: 'Good afternoon, Vikram. I am briefing you on Ticket ID #TK-4402, a Priority 3 standard request for the Scicom Regional SaaS Portal account. The client reported an automated account lockout following three failed MFA authentication attempts.', purpose: 'Stage 1 Case Overview & Stage 2 Symptom' },
          { speaker: 'Nadia (Outgoing Lead)', text: 'Initial checks confirmed credentials, and Tier-1 dispatched a secure MFA password reset link directly to the user\'s registered email. The ticket is currently sitting at Pending User Action status.', purpose: 'Stage 3 Actions Taken & Stage 4 Current Status' },
          { speaker: 'Nadia (Outgoing Lead)', text: 'The required next step is for the afternoon desk to verify the user\'s automated login log in the CRM portal and close the ticket once login is confirmed, prior to the 01:00 PM SLA window.', purpose: 'Stage 5 Oncoming Action & SLA Deadline' },
          { speaker: 'Vikram (Incoming Lead)', text: 'Got it. Ticket #TK-4402, Pending User Action, check login log by 1:00 PM. I will assign that to our desk right now. Thank you, Nadia!', purpose: 'Clear operational acknowledgement' }
        ],
        keyTakeaways: [
          'Nadia transferred all vital case facts in 65 seconds without stuttering or reading raw logs.',
          'Vikram immediately repeated the action item and deadline, achieving 100% operational continuity.'
        ]
      }
    },
    practice: {
      title: 'Formative Practice',
      subtitle: 'Handover Framework Identification',
      description: 'Practice structuring oral case summaries using the 5-stage handover model.',
      questions: [
        {
          id: 'q1',
          prompt: 'What is the primary purpose of an Oral Case Summary during a contact center shift handover?',
          options: [
            { id: 'A', text: 'To read every line of the customer\'s chat transcript aloud.', isCorrect: false, feedback: 'Incorrect: Transcripts should be synthesized, not read line-by-line.' },
            { id: 'B', text: 'To brief incoming agents on the core incident, actions taken, current status, and pending SLA actions so customer care continues seamlessly.', isCorrect: true, feedback: 'Correct! Ensures operational continuity and prevents missed SLA deadlines.' },
            { id: 'C', text: 'To complain about difficult customers to colleagues.', isCorrect: false, feedback: 'Incorrect.' }
          ]
        }
      ]
    },
    review: {
      title: 'Lesson 8 Review Quiz',
      passingScore: 2,
      questions: [
        {
          id: 'r1',
          question: 'What is Stage 5 of the BPO shift handover framework?',
          options: [
            { id: 'A', text: 'Oncoming Agent\'s Required Next Step and SLA Deadline', isCorrect: true },
            { id: 'B', text: 'Signing out of the computer and turning off the lights', isCorrect: false },
            { id: 'C', text: 'Reading customer survey scores', isCorrect: false }
          ],
          explanation: 'Stage 5 defines exactly what the next agent must do and when it is due.'
        },
        {
          id: 'r2',
          question: 'Which of the following phrases is the standard transition marker for stating current ticket status during a briefing?',
          options: [
            { id: 'A', text: '"The ticket is currently sitting at [Status]..."', isCorrect: true },
            { id: 'B', text: '"Maybe the ticket is doing something..."', isCorrect: false },
            { id: 'C', text: '"I forgot what status it is..."', isCorrect: false }
          ],
          explanation: '"The ticket is currently sitting at [Pending / Escalated / In-Progress]..." is the standard BPO idiom.'
        },
        {
          id: 'r3',
          question: 'During a shift handover, why is stating the exact SLA deadline critical?',
          options: [
            { id: 'A', text: 'Because missing an SLA breaches contractual agreements with enterprise clients and incurs financial penalties.', isCorrect: true },
            { id: 'B', text: 'Because shift leads like looking at clocks.', isCorrect: false },
            { id: 'C', text: 'Because computer software shuts down when SLAs expire.', isCorrect: false }
          ],
          explanation: 'SLAs are legal performance contracts; missed deadlines result in financial penalties for BPOs.'
        }
      ]
    },
    speaking: {
      title: 'Capstone Speaking Challenge: Shift Handover Briefing',
      workplace: 'Scicom (MSC) Berhad — Shift Transition Briefing Floor',
      customerName: 'Vikram (Incoming Shift Lead)',
      audioPrompt: 'Good afternoon, agent. Before you log off your shift, please deliver your oral case summary for Ticket TK-4402 so the afternoon desk can take over.',
      taskGoal: 'Deliver a structured 60–75 second oral shift handover summary for Ticket #TK-4402. Cover all 5 stages: 1. Case Overview, 2. Symptom Statement, 3. Actions Taken, 4. Current Status, and 5. Oncoming Action & SLA Deadline.',
      timeLimit: 75,
      hints: [
        'Stage 1: "Good afternoon. I am briefing you on Ticket ID #TK-4402, Priority 3 for Scicom Regional SaaS Portal."',
        'Stage 2: "The client reported an automated account lockout following three failed MFA attempts."',
        'Stage 3: "Initial checks confirmed credentials, and Tier-1 dispatched a secure MFA password reset link to their email."',
        'Stage 4: "The ticket is currently sitting at Pending User Action status."',
        'Stage 5: "The required next step is for the afternoon desk to verify the CRM login log and close the ticket prior to the 01:00 PM SLA window."'
      ],
      modelResponse: 'Good afternoon. I am briefing you on Ticket ID #TK-4402, a Priority 3 standard request for the Scicom Regional SaaS Portal account. The client reported an automated account lockout following three failed MFA authentication attempts. Initial checks confirmed credentials, and Tier-1 dispatched a secure MFA password reset link directly to the user\'s registered email. The ticket is currently sitting at Pending User Action status. The required next step is for the afternoon desk to verify the user\'s automated login log in the CRM portal and close the ticket once login is confirmed, prior to the 01:00 PM SLA window.',
      modelAnalysis: 'Flawlessly executes the 5-stage BPO shift handover model in 65 seconds, utilizing professional transitions (*"I am briefing you on...", "currently sitting at...", "prior to the 01:00 PM SLA window"*).',
      checklist: [
        'I stated Ticket ID, Priority level, and Account Name (Stage 1).',
        'I explained the core symptom and diagnostic actions taken (Stages 2 & 3).',
        'I stated current ticket status, next step, and the exact SLA deadline (Stages 4 & 5).'
      ]
    }
  }
};
