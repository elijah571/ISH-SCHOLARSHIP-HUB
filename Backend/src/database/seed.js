import 'dotenv/config';
import { sequelize } from './index.js';
import './models/index.js';
import { User, Scholarship, Blog, Internship } from './models/index.js';
import argon2 from 'argon2';

const scholarships = [
  {
    title: 'Chevening Scholarship 2025',
    description: `Chevening is the UK government's international awards programme aimed at developing global leaders. Funded by the Foreign, Commonwealth & Development Office (FCDO) and partner organisations, Chevening offers fully funded scholarships to study any eligible master's degree at a UK university of your choice.`,
    country: 'United Kingdom',
    deadline: new Date('2026-11-05'),
    amount: 'Full Funding',
    fundingType: 'fully-funded',
    level: 'Masters',
    host: 'UK Government / FCDO',
    link: 'https://www.chevening.org/scholarships/',
    field: 'All Fields',
    eligibility: 'Open to citizens of Chevening-eligible countries with at least 2 years of work experience and an undergraduate degree.',
    imageUrl: 'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?w=800&q=80',
  },
  {
    title: 'Gates Cambridge Scholarship',
    description: `The Gates Cambridge Scholarship programme was established in 2000 by a donation of US$210m from the Bill and Melinda Gates Foundation to the University of Cambridge. It is one of the most prestigious international scholarship programmes in the world.`,
    country: 'United Kingdom',
    deadline: new Date('2026-10-15'),
    amount: 'Full Funding',
    fundingType: 'fully-funded',
    level: 'PhD',
    host: 'University of Cambridge',
    link: 'https://www.gatescambridge.org/',
    field: 'All Fields',
    eligibility: 'Open to all citizens outside the UK who are applying to study at Cambridge.',
    imageUrl: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80',
  },
  {
    title: 'Fulbright Foreign Student Program',
    description: `The Fulbright Program is the U.S. government's flagship international educational exchange program. The Fulbright Foreign Student Program enables graduate students, young professionals and artists from abroad to study and conduct research in the United States.`,
    country: 'United States',
    deadline: new Date('2026-10-01'),
    amount: 'Full Funding',
    fundingType: 'fully-funded',
    level: 'Masters',
    host: 'U.S. Department of State',
    link: 'https://foreign.fulbrightonline.org/',
    field: 'All Fields',
    eligibility: `Open to non-U.S. citizens with a bachelor's degree and demonstrated leadership potential.`,
    imageUrl: 'https://images.unsplash.com/photo-1554306297-0c86e837d24b?w=800&q=80',
  },
  {
    title: 'DAAD Scholarships for Development-Related Postgraduate Courses',
    description: `DAAD offers scholarships for postgraduate courses in Germany related to development cooperation. These scholarships are aimed at graduates and young professionals from developing countries who want to pursue a postgraduate degree at a German university.`,
    country: 'Germany',
    deadline: new Date('2026-08-31'),
    amount: '750 EUR/month + travel allowance',
    fundingType: 'fully-funded',
    level: 'Masters',
    host: 'DAAD – German Academic Exchange Service',
    link: 'https://www.daad.de/en/',
    field: 'Development Studies',
    eligibility: 'Applicants from developing countries with at least 2 years professional experience after first university degree.',
    imageUrl: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&q=80',
  },
  {
    title: 'Australia Awards Scholarships',
    description: `Australia Awards Scholarships are long-term awards administered by the Department of Foreign Affairs and Trade. They aim to contribute to the development needs of Australia's partner countries by providing opportunities for people to undertake full-time undergraduate or postgraduate study at participating Australian universities.`,
    country: 'Australia',
    deadline: new Date('2026-04-30'),
    amount: 'Full Tuition + Living Allowance',
    fundingType: 'fully-funded',
    level: 'Masters',
    host: 'Australian Government – DFAT',
    link: 'https://www.dfat.gov.au/people-to-people/australia-awards/',
    field: 'All Fields',
    eligibility: 'Citizens of eligible countries in the Indo-Pacific, Africa, and Middle East regions.',
    imageUrl: 'https://images.unsplash.com/photo-1549877452-9c387954fbc2?w=800&q=80',
  },
  {
    title: 'Erasmus Mundus Joint Master Degrees',
    description: `Erasmus Mundus Joint Master Degrees (EMJMD) are prestigious, integrated, international study programmes, jointly delivered by an international consortium of higher education institutions. The programme offers full scholarships to outstanding students worldwide.`,
    country: 'Europe',
    deadline: new Date('2026-01-15'),
    amount: 'Full Funding + 1000 EUR/month',
    fundingType: 'fully-funded',
    level: 'Masters',
    host: 'European Commission',
    link: 'https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-catalogue_en',
    field: 'All Fields',
    eligibility: 'Open to students worldwide. No nationality restriction for most programmes.',
    imageUrl: 'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=800&q=80',
  },
  {
    title: 'MasterCard Foundation Scholars Program',
    description: `The Mastercard Foundation Scholars Program works with leading African universities to provide access to quality secondary and university education, and leadership development for talented young people from disadvantaged backgrounds, particularly young women.`,
    country: 'Africa',
    deadline: new Date('2026-03-31'),
    amount: 'Full Scholarship',
    fundingType: 'fully-funded',
    level: 'Undergraduate',
    host: 'MasterCard Foundation',
    link: 'https://mastercardfdn.org/all/scholars/',
    field: 'All Fields',
    eligibility: 'Young Africans who are academically talented but financially disadvantaged, particularly young women.',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80',
  },
  {
    title: 'Commonwealth Scholarship and Fellowship Plan',
    description: `Commonwealth Scholarships are offered by Commonwealth member countries for students from other Commonwealth countries. The scholarships are administered by various bodies in each member country and are intended to allow talented people to gain skills and knowledge in the interest of their home countries.`,
    country: 'United Kingdom',
    deadline: new Date('2026-12-18'),
    amount: 'Full Funding',
    fundingType: 'fully-funded',
    level: 'PhD',
    host: 'Commonwealth Scholarship Commission',
    link: 'https://cscuk.fcdo.gov.uk/scholarships/',
    field: 'STEM, Humanities, Social Sciences',
    eligibility: 'Citizens of Commonwealth countries who are permanent residents in a developing Commonwealth country.',
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80',
  },
  {
    title: 'Japan MEXT Scholarship',
    description: `The Japanese Government (MEXT) Scholarship Program has been implemented since 1954 to provide opportunities for foreign students to study at Japanese universities. Over 58,000 people from 160 countries have studied in Japan under this program.`,
    country: 'Japan',
    deadline: new Date('2026-05-31'),
    amount: '145,000 JPY/month',
    fundingType: 'fully-funded',
    level: 'Masters',
    host: 'Japanese Ministry of Education (MEXT)',
    link: 'https://www.mext.go.jp/en/',
    field: 'All Fields',
    eligibility: 'Must be under 35 years of age and a citizen of a country with diplomatic relations with Japan.',
    imageUrl: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=800&q=80',
  },
  {
    title: 'Aga Khan Foundation International Scholarship',
    description: `The Aga Khan Foundation provides a limited number of scholarships each year for postgraduate studies to outstanding students from developing countries who have no other means of financing their studies. Scholarships are awarded on a 50% grant and 50% loan basis.`,
    country: 'Multiple Countries',
    deadline: new Date('2026-03-31'),
    amount: 'Partial to Full Funding',
    fundingType: 'partially-funded',
    level: 'Masters',
    host: 'Aga Khan Foundation',
    link: 'https://www.akdn.org/our-agencies/aga-khan-foundation/international-scholarship-programme',
    field: 'Development, Health, Education, Environment',
    eligibility: 'Exceptional students from developing countries with a consistent record of academic achievement.',
    imageUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80',
  },
  {
    title: 'ETH Zurich Excellence Scholarship',
    description: `ETH Zurich offers the Excellence Scholarship and Opportunity Programme (ESOP) for outstanding students wishing to pursue a master's degree at ETH Zurich. The scholarship covers tuition fees and a monthly living allowance.`,
    country: 'Switzerland',
    deadline: new Date('2026-12-15'),
    amount: 'CHF 12,000/year + Tuition',
    fundingType: 'fully-funded',
    level: 'Masters',
    host: 'ETH Zurich',
    link: 'https://ethz.ch/en/studies/financial/scholarships/excellencescholarship.html',
    field: 'Engineering, Natural Sciences, Mathematics',
    eligibility: `Outstanding students wishing to pursue a master's degree at ETH Zurich, regardless of nationality.`,
    imageUrl: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80',
  },
  {
    title: 'Korean Government Scholarship Program (KGSP)',
    description: `The Korean Government Scholarship Program (KGSP) is funded by the Korean Ministry of Education to promote international exchange in education and develop friendship with other nations. Selected scholars receive full funding for their studies in Korea.`,
    country: 'South Korea',
    deadline: new Date('2026-09-30'),
    amount: 'Full Funding + 900,000 KRW/month',
    fundingType: 'fully-funded',
    level: 'Masters',
    host: 'Korean Ministry of Education',
    link: 'https://www.studyinkorea.go.kr/en/sub/gks/allnew_invite.do',
    field: 'All Fields',
    eligibility: `Citizens of designated countries under 40 years of age with a bachelor's degree and good health.`,
    imageUrl: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&q=80',
  },
];

const blogs = [
  {
    title: 'How to Write a Winning Scholarship Essay: 10 Proven Tips',
    slug: 'how-to-write-winning-scholarship-essay',
    content: `Writing a scholarship essay can feel daunting, but with the right approach, you can craft a compelling narrative that sets you apart. Here are 10 proven tips to help you succeed.

**1. Start with a Strong Hook**
Your opening sentence should grab the reader's attention immediately. Avoid clichés like "From a young age, I have always wanted to..." Instead, start with a specific story, a surprising fact, or a bold statement.

**2. Answer the Question Directly**
Many applicants make the mistake of writing a generic essay. Read the prompt carefully and ensure every paragraph ties back to the specific question being asked.

**3. Show, Don't Tell**
Instead of saying "I am a dedicated leader," describe a specific situation where you demonstrated leadership. Use the STAR method: Situation, Task, Action, Result.

**4. Be Authentic**
Scholarship committees read thousands of essays. What makes yours memorable is your unique voice and genuine story. Do not try to sound like someone else.

**5. Highlight Your Impact**
Scholarship providers want to fund people who will make a difference. Clearly articulate the impact you have already made and how the scholarship will amplify your future contributions.

**6. Connect Your Past to Your Future**
A great scholarship essay traces a clear line from your background and experiences to your current goals and how this scholarship specifically fits into your vision.

**7. Address Weaknesses Proactively**
If you have a gap in your academic record or a challenging period in your life, address it briefly and focus on what you learned and how you grew.

**8. Tailor Each Essay**
Never submit the same essay to multiple scholarships. Research each organization's mission and values, then customize your essay to reflect alignment with their goals.

**9. Edit Ruthlessly**
Your first draft will not be your best. Revise for clarity, conciseness, and impact. Remove every word that does not add value. Aim for precision.

**10. Get Feedback**
Ask a mentor, teacher, or trusted friend to review your essay. Fresh eyes catch errors and logical gaps that you might miss after reading the same text repeatedly.`,
    published: true,
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
  },
  {
    title: 'Top 10 Fully Funded Scholarships for African Students in 2025',
    slug: 'top-10-fully-funded-scholarships-african-students-2025',
    content: `African students have more scholarship opportunities than ever before. Here is a curated list of the top 10 fully funded scholarships available to African students in 2025.

**1. Chevening Scholarship (UK)**
One of the most prestigious scholarships in the world, Chevening offers full funding for one-year master's degrees at UK universities. It covers tuition, living expenses, and travel.

**2. MasterCard Foundation Scholars Program**
Specifically designed for talented but financially disadvantaged young Africans, this program partners with top African and global universities.

**3. DAAD Scholarships (Germany)**
The German Academic Exchange Service offers multiple scholarship programs for African students at all levels, including masters and PhD.

**4. Commonwealth Scholarships**
Available to citizens of Commonwealth nations, these scholarships cover postgraduate study in the UK with full funding.

**5. Fulbright Foreign Student Program (USA)**
The flagship US government scholarship offers full funding for graduate study and research in America.

**6. Australia Awards Scholarships**
The Australian Government offers these awards to students from eligible African countries for undergraduate and postgraduate study.

**7. Swedish Institute Scholarships**
Sweden offers fully funded master's scholarships for students from certain African countries through the Swedish Institute.

**8. Korea-Africa Foundation Scholarship**
The Korean government offers scholarships specifically for African students to study in South Korea.

**9. Eiffel Excellence Scholarship (France)**
The French Ministry for Europe and Foreign Affairs offers this scholarship to outstanding international students for master's and PhD study in France.

**10. Intra-Africa Academic Mobility Scheme**
The European Union funds mobility grants for African students to study at universities in other African countries.`,
    published: true,
    imageUrl: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800&q=80',
  },
  {
    title: 'IELTS vs TOEFL: Which English Test Should You Take for Your Scholarship?',
    slug: 'ielts-vs-toefl-which-english-test-scholarship',
    content: `One of the most common questions from scholarship applicants is: should I take IELTS or TOEFL? Both tests demonstrate English proficiency, but they have important differences that can affect your scholarship application.

**What is IELTS?**
The International English Language Testing System (IELTS) is co-owned by the British Council, IDP Education, and Cambridge Assessment English. It is available in two formats: Academic and General Training. For scholarship applications, you will almost always need the Academic version.

**What is TOEFL?**
The Test of English as a Foreign Language (TOEFL) is owned and administered by the Educational Testing Service (ETS). The most widely accepted version for academic purposes is TOEFL iBT (internet-based test).

**Key Differences**

Format: IELTS uses human examiners for the speaking test (face-to-face interview), while TOEFL speaking is recorded and assessed by human raters remotely.

Scoring: IELTS scores on a scale of 0–9 in band scores. TOEFL scores on a scale of 0–120.

Acceptance: IELTS is widely accepted in the UK, Australia, Canada, and Europe. TOEFL is more commonly accepted in the USA and is equally accepted worldwide.

**Which Should You Choose?**
If applying to UK, Australian, or European scholarships: IELTS is generally preferred. If applying to US scholarships like Fulbright: TOEFL or IELTS are both accepted. Choose based on your strengths: IELTS rewards conversational ability; TOEFL rewards integrated academic skills.

**Score Requirements for Top Scholarships**
Chevening: IELTS 6.5. Fulbright: TOEFL iBT 79+ or IELTS 6.5+. DAAD: IELTS 6.0 or TOEFL 79 (iBT). Gates Cambridge: IELTS 7.5 or TOEFL 110.`,
    published: true,
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
  },
  {
    title: 'How to Get a Strong Letter of Recommendation for Your Scholarship',
    slug: 'how-to-get-strong-letter-of-recommendation-scholarship',
    content: `A powerful letter of recommendation can be the difference between a scholarship offer and a rejection. Here is how to secure the best letters of recommendation for your scholarship application.

**Choose the Right Recommenders**
Select people who know you well academically or professionally and can speak to specific qualities the scholarship values. The best recommenders are professors who supervised your thesis or research, supervisors from relevant work or internship experience, and community leaders who have witnessed your leadership in action.

Avoid choosing people simply because of their title. A vice chancellor who barely knows you will write a weaker letter than a lecturer who mentored you closely.

**Ask Early**
Approach your recommenders at least 6–8 weeks before the deadline. This gives them adequate time to write a thoughtful, detailed letter rather than a rushed generic one.

**Prepare a Recommender Package**
Make it easy for your recommenders by providing your updated CV, your personal statement or scholarship essay, a summary of your achievements relevant to this scholarship, the scholarship's goals and criteria, and the submission deadline and instructions.

**Brief Them on the Scholarship**
Help your recommenders understand what the scholarship committee is looking for. Share the scholarship's mission, values, and the profile of an ideal candidate.

**What Makes a Great Letter Stand Out**
The best recommendation letters are specific, not generic. They include concrete examples and anecdotes, quantifiable achievements where possible, and genuine enthusiasm from the recommender.`,
    published: true,
    imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80',
  },
  {
    title: 'Life as an International Student in the UK: What You Need to Know',
    slug: 'life-as-international-student-uk-what-you-need-to-know',
    content: `Studying in the United Kingdom is a life-changing experience. But before you pack your bags, there are some important things every international student should know.

**Visa Requirements**
Most international students need a Student visa to study in the UK. You must have a Confirmation of Acceptance for Studies (CAS) from your university, proof of English language proficiency, evidence of sufficient funds to support yourself, and a clean criminal record in most cases.

**Cost of Living**
The UK is not cheap. London is significantly more expensive than other cities. Budget approximately 1,200–1,800 GBP/month for London and 800–1,200 GBP/month for other cities. This includes accommodation, food, transport, and personal expenses.

**Healthcare**
International students studying for more than 6 months pay the Immigration Health Surcharge (IHS) as part of their visa application. This gives access to the NHS during your stay — a significant benefit.

**Academic Culture**
UK universities expect independent thinking and critical analysis. Tutorials and seminars require active participation. Plagiarism is taken extremely seriously — always cite your sources.

**Work Rights**
Most student visas permit up to 20 hours of part-time work per week during term time and full-time during holidays. This can help supplement your living expenses.

**Mental Health**
Culture shock is real. Most universities have excellent mental health support services. Do not hesitate to use them. Maintaining connections with family and friends back home while building new friendships is key.`,
    published: true,
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
  },
];

const internships = [
  {
    title: 'Software Engineering Intern – Summer 2026',
    institution: 'Google',
    country: 'United States',
    description: `Join Google as a Software Engineering Intern and work on real-world projects that impact billions of users. You will work alongside full-time engineers on a specific team, contribute to codebases at scale, and present your work at the end of the internship. Google interns are treated as full members of their team and given meaningful, impactful work from day one.`,
    type: 'paid',
    deadline: new Date('2026-09-30'),
    startDate: new Date('2027-06-01'),
    endDate: new Date('2027-08-31'),
    link: 'https://careers.google.com/students/',
    imageUrl: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=800&q=80',
  },
  {
    title: 'Data Science Intern',
    institution: 'United Nations Global Pulse',
    country: 'Multiple Countries',
    description: `UN Global Pulse is looking for a Data Science Intern to support its mission of harnessing big data for development and humanitarian action. You will work on data pipelines, machine learning models, and data visualizations that inform UN policy. This is an exceptional opportunity to apply data science to real global challenges.`,
    type: 'paid',
    deadline: new Date('2026-08-15'),
    startDate: new Date('2026-10-01'),
    endDate: new Date('2026-12-31'),
    link: 'https://www.unglobalpulse.org/',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
  },
  {
    title: 'Research Intern – Public Health',
    institution: 'World Health Organization',
    country: 'Switzerland',
    description: `The World Health Organization offers internships across its departments. As a Public Health Research Intern, you will support WHO technical officers in preparing research papers, analysing health data, and contributing to global health policy documents. This position is based at WHO headquarters in Geneva.`,
    type: 'unpaid',
    deadline: new Date('2026-07-31'),
    startDate: new Date('2026-09-01'),
    endDate: new Date('2026-11-30'),
    link: 'https://www.who.int/careers/internships',
    imageUrl: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800&q=80',
  },
  {
    title: 'Marketing Intern – Africa Operations',
    institution: 'Flutterwave',
    country: 'Nigeria',
    description: `Flutterwave, Africa's leading payments technology company, is seeking a Marketing Intern to support campaigns across its African markets. You will assist with content creation, social media management, market research, and event coordination. This role offers hands-on experience in one of Africa's fastest-growing tech companies.`,
    type: 'paid',
    deadline: new Date('2026-10-31'),
    startDate: new Date('2026-12-01'),
    endDate: new Date('2027-02-28'),
    link: 'https://www.flutterwave.com/ng/careers',
    imageUrl: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f5a07d?w=800&q=80',
  },
  {
    title: 'Finance and Investment Intern',
    institution: 'African Development Bank',
    country: 'Cote d\'Ivoire',
    description: `The African Development Bank Group internship program offers university students and recent graduates an opportunity to gain professional experience in an international development finance institution. Interns work on real projects that contribute to Africa's economic development and transformation.`,
    type: 'paid',
    deadline: new Date('2026-11-30'),
    startDate: new Date('2027-01-15'),
    endDate: new Date('2027-04-15'),
    link: 'https://www.afdb.org/en/careers/internship-program',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
  },
  {
    title: 'UX/UI Design Intern',
    institution: 'Andela',
    country: 'Kenya',
    description: `Andela is looking for a passionate UX/UI Design Intern to join its product team. You will work closely with product managers and engineers to design intuitive interfaces for Andela's talent marketplace platform used by thousands of developers across Africa. Strong portfolio required.`,
    type: 'paid',
    deadline: new Date('2026-09-15'),
    startDate: new Date('2026-11-01'),
    endDate: new Date('2027-01-31'),
    link: 'https://andela.com/careers/',
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
  },
  {
    title: 'Climate Change Policy Intern',
    institution: 'United Nations Environment Programme',
    country: 'Kenya',
    description: `UNEP is seeking a Climate Change Policy Intern to support work on the implementation of the Paris Agreement and Sustainable Development Goals. The intern will assist with policy research, stakeholder engagement, and preparation of reports and presentations for international climate negotiations.`,
    type: 'unpaid',
    deadline: new Date('2026-08-31'),
    startDate: new Date('2026-10-01'),
    endDate: new Date('2026-12-31'),
    link: 'https://www.unep.org/about-un-environment/careers',
    imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80',
  },
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    // Find or create base admin
    let admin = await User.findOne({ where: { role: 'admin' } });
    if (!admin) {
      const hash = await argon2.hash('Admin1234!');
      admin = await User.create({
        fullName: 'Admin User',
        email: 'admin@ish.com',
        password: hash,
        role: 'admin',
        isEmailVerified: true,
      });
      console.log('Admin user created');
    }

    // Upsert Francis as admin
    const francisHash = await argon2.hash('1234567890Pe*');
    await User.upsert({
      email: 'francisonyedikachuks@gmail.com',
      fullName: 'Francis Onyedikachukwu',
      password: francisHash,
      role: 'admin',
      isEmailVerified: true,
    }, { conflictFields: ['email'] });
    console.log('Francis admin upserted');

    // Seed scholarships
    let created = 0;
    for (const s of scholarships) {
      const exists = await Scholarship.findOne({ where: { title: s.title } });
      if (!exists) {
        await Scholarship.create({ duration: '1 Year', ...s, createdById: admin.id });
        created++;
      }
    }
    console.log(`Scholarships: ${created} created, ${scholarships.length - created} already existed`);

    // Seed blogs
    created = 0;
    for (const b of blogs) {
      const exists = await Blog.findOne({ where: { slug: b.slug } });
      if (!exists) {
        await Blog.create({ ...b, createdById: admin.id });
        created++;
      }
    }
    console.log(`Blogs: ${created} created, ${blogs.length - created} already existed`);

    // Seed internships
    created = 0;
    for (const i of internships) {
      const exists = await Internship.findOne({ where: { title: i.title } });
      if (!exists) {
        await Internship.create({ ...i, createdById: admin.id });
        created++;
      }
    }
    console.log(`Internships: ${created} created, ${internships.length - created} already existed`);

    console.log('\nSeeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    console.error(err);
    process.exit(1);
  }
}

seed();
