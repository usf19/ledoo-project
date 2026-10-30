/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SkillItem {
  name: string;
  category: 'programming' | 'database' | 'erp';
  description: string;
  badge?: string;
}

export interface OdooModuleItem {
  id: string;
  name: string;
  icon: string;
  role: string;
  workflow: string;
  description: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  problemSolved: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  status: 'Completed' | 'In Progress' | 'Planned';
  date: string;
}

export const YOUSEF_PROFILE = {
  name: 'Yousef Waleed',
  title: 'Business Information Systems Student | Aspiring Odoo ERP Developer',
  headline: 'Turning Business Logic into Automated Solutions.',
  location: 'Ashmoun, Al Minufiyah, Egypt',
  education: {
    institution: 'Higher Institute for Computers, Information and Management Technology – Tanta',
    degree: 'Bachelor of Business Information Systems (BIS)',
    duration: 'Undergraduate Student',
    highlights: [
      'Core focus on Enterprise Resource Planning (ERP) & Business Process Automation',
      'Integration of Information Systems, Systems Analysis, and Database Architecture',
      'Bridging Business Management and Applied Software Engineering in Python',
    ],
  },
  introduction:
    "I'm a Business Information Systems student passionate about technology, software development, and business automation. I combine my understanding of business processes with programming skills to build practical solutions that improve workflows and solve real-world problems.\n\nI'm currently developing my knowledge of Odoo ERP, exploring how different business operations connect through integrated systems, and building practical projects to turn business logic into automated solutions.",
  aboutExtended:
    'As a Business Information Systems (BIS) student, my unique strength lies in seeing both sides of the coin: understanding the economic and operational needs of a business enterprise, and possessing the technical coding skills to translate those requirements into efficient, automated software modules. I focus on continuous learning, self-driven research, and hands-on development in Python, relational databases, and Odoo ERP architectures.',
  contact: {
    email: 'yousefwaleedelmasry@gmail.com',
    location: 'Ashmoun, Al Minufiyah, Egypt',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
};

export const SKILLS_DATA: {
  category: string;
  title: string;
  description: string;
  skills: SkillItem[];
}[] = [
  {
    category: 'programming',
    title: 'Programming & Development',
    description: 'Core languages used to engineer robust business logic, OOP models, and web interfaces.',
    skills: [
      { name: 'Python', category: 'programming', description: 'Core programming language for backend & Odoo development', badge: 'Core' },
      { name: 'Python OOP', category: 'programming', description: 'Object-Oriented Architecture, class inheritance, methods, data models', badge: 'Specialized' },
      { name: 'JavaScript', category: 'programming', description: 'Client-side interactivity and web logic', badge: 'Web' },
      { name: 'HTML5', category: 'programming', description: 'Semantic structure for web views and forms', badge: 'Markup' },
      { name: 'CSS3', category: 'programming', description: 'Modern responsive layout, styling, and UI design', badge: 'Styling' },
    ],
  },
  {
    category: 'database',
    title: 'Databases & Data Modeling',
    description: 'Relational data structures, query optimization, and enterprise persistence layers.',
    skills: [
      { name: 'PostgreSQL', category: 'database', description: 'Primary relational database engine powering Odoo ERP models & ORM', badge: 'Primary' },
      { name: 'MySQL', category: 'database', description: 'Relational database management, normalization & indexing', badge: 'RDBMS' },
      { name: 'SQL', category: 'database', description: 'Structured querying, joins, constraints, triggers, and aggregations', badge: 'Standard' },
    ],
  },
  {
    category: 'erp',
    title: 'ERP & Business Systems',
    description: 'Enterprise integration, department-wide workflow automation, and process engineering.',
    skills: [
      { name: 'Odoo ERP', category: 'erp', description: 'Modular ERP framework, custom modules, XML views, and ORM operations', badge: 'Specialization' },
      { name: 'CRM', category: 'erp', description: 'Lead pipelines, customer interaction tracking, and conversion stages', badge: 'Module' },
      { name: 'Sales Management', category: 'erp', description: 'Quotation-to-order lifecycles, pricing rules, and sales automation', badge: 'Workflow' },
      { name: 'Inventory Management', category: 'erp', description: 'Stock tracking, reordering rules, warehouse transfers, and picking', badge: 'Logistics' },
      { name: 'Business Process Automation', category: 'erp', description: 'Automating cross-departmental business workflows and validation rules', badge: 'Strategy' },
    ],
  },
];

export const ODOO_MODULES: OdooModuleItem[] = [
  {
    id: 'crm',
    name: 'CRM & Lead Management',
    icon: 'Users',
    role: 'Top-of-Funnel Conversion',
    workflow: 'Lead Capture → Qualification → Quotation Generation',
    description:
      'Tracking prospective clients through visual Kanban stages, scoring opportunities, and automatically passing qualified leads directly into sales quotations.',
  },
  {
    id: 'sales',
    name: 'Sales Management',
    icon: 'BadgePercent',
    role: 'Commercial Execution',
    workflow: 'Quotation → Confirmation → Automated Delivery & Invoice Trigger',
    description:
      'Managing client orders with automated pricing matrices, customer validation, and instantaneous handoff to inventory delivery and accounting.',
  },
  {
    id: 'inventory',
    name: 'Inventory & Warehousing',
    icon: 'Package',
    role: 'Supply Chain Fulfillment',
    workflow: 'Stock Reservation → Automated Picking/Packing → Stock Level Updates',
    description:
      'Real-time stock valuation, multi-warehouse routing, automated minimum stock replenishment rules, and seamless coordination with purchase orders.',
  },
  {
    id: 'invoicing',
    name: 'Invoicing & Accounting',
    icon: 'Receipt',
    role: 'Financial Reconciliation',
    workflow: 'Sales Order → Draft Invoice → Validation → Payment Reconciliation',
    description:
      'Ensuring strict double-entry ledger posting, automating recurring billing cycles, and reconciling bank payments with customer invoices.',
  },
  {
    id: 'automation',
    name: 'Process Automation Engine',
    icon: 'Cpu',
    role: 'Custom Python Logic & Automated Actions',
    workflow: 'Event Trigger → Python Condition Check → Action Execution',
    description:
      'Writing custom Python server actions, automated email alerts, approval rules, and background scheduled actions to eliminate manual data entry.',
  },
];

export const FEATURED_PROJECTS: PortfolioProject[] = [
  {
    id: 'odoo-sales-inventory',
    title: 'Odoo Sales & Inventory Custom Automation Module',
    subtitle: 'Custom ERP Module Development',
    category: 'Odoo ERP / Python',
    description:
      'A custom Odoo module designed to automate stock verification upon sales quotation confirmation. Implements custom Python model extensions with automated notifications for backorders.',
    problemSolved:
      'Eliminated manual warehouse check delays by automatically validating stock availability when a sales representative confirms an order.',
    technologies: ['Odoo 17/18', 'Python', 'PostgreSQL', 'XML Views', 'Odoo ORM'],
    githubUrl: 'https://github.com/yousefwaleed/odoo-sales-automation-module',
    status: 'In Progress',
    date: '2026',
  },
  {
    id: 'python-business-workflow',
    title: 'Business Workflow & Transaction Simulator',
    subtitle: 'Python OOP Enterprise Logic',
    category: 'Software Engineering',
    description:
      'A modular console and GUI simulation applying Python OOP patterns (Factory, Observer, State) to model commercial transactions, inventory deductions, and customer balances.',
    problemSolved:
      'Demonstrates clean separation of concerns between business domain logic, validation constraints, and persistent state storage.',
    technologies: ['Python 3.12', 'Python OOP', 'SQLite', 'Design Patterns'],
    githubUrl: 'https://github.com/yousefwaleed/python-business-workflow-simulator',
    status: 'Completed',
    date: '2025',
  },
  {
    id: 'erp-database-schema',
    title: 'Enterprise Relational Database Schema & Architecture',
    subtitle: 'PostgreSQL Relational Design',
    category: 'Databases & Modeling',
    description:
      'Comprehensive database blueprint for a multi-branch retail organization, featuring 3NF normalized tables, foreign key constraints, indexing for high-volume sales, and SQL analytical views.',
    problemSolved:
      'Structured relational data to prevent anomalies during concurrent inventory transactions and generated fast SQL sales reporting views.',
    technologies: ['PostgreSQL', 'SQL', 'Database Normalization', 'Relational Modeling'],
    githubUrl: 'https://github.com/yousefwaleed/enterprise-erp-db-schema',
    status: 'Completed',
    date: '2025',
  },
  {
    id: 'bis-operations-tracker',
    title: 'Operations & Procurement Management Dashboard',
    subtitle: 'Web-Based Business Application',
    category: 'Full-Stack Development',
    description:
      'Interactive business dashboard tracking purchase requisitions, supplier quotes, and approval states with real-time status visualization.',
    problemSolved:
      'Streamlined internal requisition approval bottlenecks by visualizing pending orders by status and expected lead time.',
    technologies: ['Python', 'JavaScript', 'HTML5', 'CSS3', 'MySQL'],
    githubUrl: 'https://github.com/yousefwaleed/bis-procurement-dashboard',
    status: 'Completed',
    date: '2024',
  },
];
