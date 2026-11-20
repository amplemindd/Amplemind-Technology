const chatbotData = {

  /* ==========================================
      COMPANY DETAILS
  ========================================== */

  company: {

    name: "AmpleMind Technologies",

    tagline: "Learn • Build • Get Placed",

    email: "info@amplemind.com",

    phone: "+91 9876543210",

    whatsapp: "+91 9876543210",

    address: "Nagpur, Maharashtra",

    website: "https://amplemind.com"

  },

  /* ==========================================
      CHATBOT SETTINGS
  ========================================== */

  settings: {

    chatbotName: "AmpleMind Assistant",

    chatbotIcon: "🤖",

    onlineStatus: "🟢 Online"

  },

  /* ==========================================
      WELCOME MESSAGE
  ========================================== */

  welcomeMessages: [

    "👋 Welcome to AmpleMind Technologies.",

    "I'm your virtual assistant.",

    "Please choose an option below."

  ],

  /* ==========================================
      MAIN MENU
  ========================================== */

  mainMenu: [

    {
      id: "courses",
      icon: "📚",
      title: "Courses",
      subtitle: "Explore Our Courses"
    },

    {
      id: "internship",
      icon: "🎓",
      title: "Internship",
      subtitle: "Internship Programs"
    },

    {
      id: "services",
      icon: "💻",
      title: "Services",
      subtitle: "Software Development"
    },

    {
      id: "placement",
      icon: "💼",
      title: "Placement",
      subtitle: "Placement Assistance"
    },

    {
      id: "contact",
      icon: "📞",
      title: "Contact",
      subtitle: "Talk with our Team"
    }

  ],

  /* ==========================================
      COURSES
  ========================================== */

  courses: [

    {

      id: "java",

      icon: "☕",

      name: "Java Full Stack",

      shortDescription: "Become Java Full Stack Developer",

      duration: "6 Months",

      mode: "Online / Offline",

      eligibility: "12th / Diploma / Graduate",

      certificate: "Industry Certificate",

      placement: "100% Placement Assistance",

      trainer: "Senior Java Trainer",

      syllabus: [

        "Core Java",

        "Advanced Java",

        "JDBC",

        "Servlet",

        "JSP",

        "Hibernate",

        "Spring Boot",

        "Spring Security",

        "REST API",

        "React JS",

        "MySQL"

      ],

      projects: [

        "Employee Management System",

        "Hospital Management",

        "E-Commerce Website"

      ]

    },

    {

      id: "mern",

      icon: "🌐",

      name: "MERN Stack",

      shortDescription: "MongoDB Express React Node",

      duration: "6 Months",

      mode: "Online / Offline",

      eligibility: "12th / Diploma / Graduate",

      certificate: "Industry Certificate",

      placement: "100% Placement Assistance",

      trainer: "Senior MERN Trainer",

      syllabus: [

        "HTML",

        "CSS",

        "Bootstrap",

        "JavaScript",

        "React",

        "Node",

        "Express",

        "MongoDB"

      ],

      projects: [

        "Travel Website",

        "Food Delivery",

        "Shopping Website"

      ]

    },

    {

      id: "python",

      icon: "🐍",

      name: "Python Full Stack",

      shortDescription: "Become Python Developer",

      duration: "5 Months",

      mode: "Online /Offline",

      eligibility: "12th / Diploma / Graduate",

      certificate: "Industry Certificate",

      placement: "100% Placement Assistance",

      trainer: "Senior Python Trainer",

      syllabus: [

        "Python",

        "OOP",

        "Flask",

        "Django",

        "REST API",

        "HTML",

        "CSS",

        "JavaScript",

        "MySQL"

      ],

      projects: [

        "Library Management",

        "Student Management",

        "Blog Website"

      ]

    },

    {

      id: "react",

      icon: "⚛",

      name: "React JS",

      shortDescription: "Frontend Development",

      duration: "2 Months",

      mode: "Online / Offline",

      eligibility: "Basic HTML CSS JS",

      certificate: "Industry Certificate",

      placement: "Placement Assistance",

      trainer: "Senior React Trainer",

      syllabus: [

        "Components",

        "Hooks",

        "Props",

        "State",

        "React Router",

        "Context API"

      ],

      projects: [

        "Portfolio",

        "Admin Dashboard"

      ]

    },

    {

      id: "ai",

      icon: "🤖",

      name: "Artificial Intelligence",

      shortDescription: "AI & Machine Learning",

      duration: "4 Months",

      mode: "Online / Offline",

      eligibility: "Basic Python",

      certificate: "Industry Certificate",

      placement: "Placement Assistance",

      trainer: "AI Expert",

      syllabus: [

        "Python",

        "Machine Learning",

        "Deep Learning",

        "Prompt Engineering",

        "Generative AI"

      ],

      projects: [

        "AI Chatbot",

        "Image Generator"

      ]

    }

  ],

  /* ==========================================
      INTERNSHIP
  ========================================== */

  internship: {

    title: "Internship Programs",

    description:
      "Industry Based Internship with Live Projects."

  },

  /* ==========================================
      SERVICES
  ========================================== */

  services: [

    {

      title: "Website Development"

    },

    {

      title: "Software Development"

    },

    {

      title: "Mobile App Development"

    },

    {

      title: "Cloud Solutions"

    },

    {

      title: "UI / UX Design"

    }

  ],

  /* ==========================================
      PLACEMENT
  ========================================== */

  placement: {

    benefits: [

      "Resume Building",

      "Mock Interview",

      "HR Interview",

      "Technical Interview",

      "Job Assistance"

    ]

  },

  /* ==========================================
      CONTACT FORM
  ========================================== */

  contactForm: [

    {

      id: "name",

      label: "Full Name",

      type: "text",

      required: true

    },

    {

      id: "email",

      label: "Email",

      type: "email",

      required: true

    },

    {

      id: "phone",

      label: "Phone",

      type: "tel",

      required: true

    },

    {

      id: "course",

      label: "Course",

      type: "text",

      required: true

    },

    {

      id: "message",

      label: "Message",

      type: "textarea",

      required: false

    }

  ],

  /* ==========================================
      FAQ
  ========================================== */

  faq: [

    {

      question: "Do you provide Certificate?",

      answer: "Yes"

    },

    {

      question: "Placement Available?",

      answer: "Yes"

    },

    {

      question: "Live Projects?",

      answer: "Yes"

    },

    {

      question: "Online Classes?",

      answer: "Yes"

    }

  ]

};

export default chatbotData;