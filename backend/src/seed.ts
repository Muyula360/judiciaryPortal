import { prisma } from '../src/config/database';
import dotenv from 'dotenv';
dotenv.config();

async function seed() {
  try {
    const initialIcons = [
      { name: 'FaBalanceScale', label: 'Balance Scale' },
      { name: 'FaMoneyBillWave', label: 'Money Bill Wave' },
      { name: 'FaBook', label: 'Book' },
      { name: 'FaUniversity', label: 'University' },
      { name: 'FaCompressArrowsAlt', label: 'Compress Arrows' },
      { name: 'FaBuilding', label: 'Building' },
      { name: 'FaGavel', label: 'Gavel' },
      { name: 'FaDatabase', label: 'Database' },
      { name: 'FaBookOpen', label: 'Book Open' },
      { name: 'FaGlobe', label: 'Globe' },
      { name: 'FaMapMarkerAlt', label: 'Map Marker' },
      { name: 'FaComment', label: 'Comment' },
      { name: 'FaPeopleArrows', label: 'People Arrows' },
      { name: 'FaBroadcastTower', label: 'Broadcast Tower' },
      { name: 'FaFolderOpen', label: 'Folder Open' },
      { name: 'FaClipboardList', label: 'Clipboard List' },
      { name: 'FaLandmark', label: 'Landmark' },
      { name: 'FaEnvelope', label: 'Envelope' },
      { name: 'FaMailBulk', label: 'Mail Bulk' },
      { name: 'FaUserTie', label: 'User Tie' },
    ];

    console.log('🌱 Seeding icons...');
    for (const icon of initialIcons) {
      await prisma.icon.upsert({
        where: { name: icon.name },
        update: { label: icon.label },
        create: { name: icon.name, label: icon.label },
      });
    }


    const categories = [
      {
        slug: 'case_management',
        name: 'Case Management Systems',
        iconName: 'FaBalanceScale',
        colorHex: '#ea580c',
      },
      {
        slug: 'informations_systems',
        name: 'Courts and Legal Information',
        iconName: 'FaLandmark',
        colorHex: '#ea580c',
      },
      {
        slug: 'judiciary_stakeholders',
        name: 'Judiciary Stakeholders',
        iconName: 'FaPeopleArrows',
        colorHex: '#ea580c',
      },
      {
        slug: 'external_systems',
        name: 'Other Systems',
        iconName: 'FaCompressArrowsAlt',
        colorHex: '#ea580c',
      },
    ];

    for (const categoryData of categories) {
      await prisma.category.upsert({
        where: { slug: categoryData.slug },
        update: {
          name: categoryData.name,
          iconName: categoryData.iconName,
          colorHex: categoryData.colorHex,
        },
        create: categoryData,
      });
    }

    const externalCategory = await prisma.category.findUnique({
      where: { slug: 'external_systems' },
    });
    const caseManagementCategory = await prisma.category.findUnique({
      where: { slug: 'case_management' },
    });
    const informationCategory = await prisma.category.findUnique({
      where: { slug: 'informations_systems' },
    });
    const stakeholderCategory = await prisma.category.findUnique({
      where: { slug: 'judiciary_stakeholders' },
    });

    if (!externalCategory || !caseManagementCategory || !informationCategory || !stakeholderCategory) {
      throw new Error('Categories not found. Please seed categories first.');
    }

    const linksData = [
      {
        name: 'eCMS',
        slug: 'ecms',
        url: 'https://cms.judiciary.go.tz/login',
        desc: 'JoT e-Case Filing System',
        iconName: 'FaGavel',
        status: 'online' as const,
        permit: 'internal' as const,
        categoryId: caseManagementCategory.id,
      },
      {
        name: 'Virtual Court',
        slug: 'virtual-court',
        url: 'https://virtualcourt.judiciary.go.tz/',
        desc: 'Judiciary of Tanzania Online Court',
        iconName: 'FaBroadcastTower',
        status: 'online' as const,
        permit: 'internal' as const,
        categoryId: caseManagementCategory.id,
      },
      {
        name: 'DataHub',
        slug: 'datahub',
        url: 'https://datahub.judiciary.go.tz/superset/welcome/',
        desc: 'Judiciary of Tanzania DataHub',
        iconName: 'FaDatabase',
        status: 'online' as const,
        permit: 'internal' as const,
        categoryId: caseManagementCategory.id,
      },
      {
        name: 'Case Details',
        slug: 'case-details',
        url: '/case_details',
        desc: 'Find case details on your own',
        iconName: 'FaFolderOpen',
        status: 'online' as const,
        permit: 'internal' as const,
        categoryId: caseManagementCategory.id,
      },
      {
        name: 'Cause List',
        slug: 'cause-list',
        url: '/cause_list',
        desc: 'Find cause list for specific court easily',
        iconName: 'FaClipboardList',
        status: 'online' as const,
        permit: 'internal' as const,
        categoryId: caseManagementCategory.id,
      },

      {
        name: 'Legal Resource Library',
        slug: 'legal-resource-library',
        url: 'https://lrl.judiciary.go.tz/home',
        desc: 'Judiciary of Tanzania Legal Resources Library',
        iconName: 'FaBookOpen',
        status: 'online' as const,
        permit: 'external' as const,
        categoryId: informationCategory.id,
      },
      {
        name: 'Judiciary Website',
        slug: 'judiciary-website',
        url: 'https://www.judiciary.go.tz/',
        desc: 'Judiciary of Tanzania main website',
        iconName: 'FaGlobe',
        status: 'online' as const,
        permit: 'external' as const,
        categoryId: informationCategory.id,
      },
      {
        name: 'Judiciary Mapping',
        slug: 'judiciary-mapping',
        url: 'https://jmap.judiciary.go.tz/home',
        desc: 'Find the Location and Direction of the Court',
        iconName: 'FaMapMarkerAlt',
        status: 'online' as const,
        permit: 'external' as const,
        categoryId: informationCategory.id,
      },
      {
        name: 'Feedback',
        slug: 'feedback',
        url: 'https://sema.judiciary.go.tz/',
        desc: 'Sema na Mahakama, Toa maoni yako',
        iconName: 'FaComment',
        status: 'online' as const,
        permit: 'external' as const,
        categoryId: informationCategory.id,
      },

      {
        name: 'Government Mail',
        slug: 'government-mail',
        url: 'https://mail.judiciary.go.tz/',
        desc: 'Official judiciary email system',
        iconName: 'FaEnvelope',
        status: 'online' as const,
        permit: 'internal' as const,
        categoryId: stakeholderCategory.id,
      },
      {
        name: 'CBPS',
        slug: 'cbps',
        url: '#',
        desc: 'Judiciary Court Brokers and Process Server system',
        iconName: 'FaMailBulk',
        status: 'online' as const,
        permit: 'internal' as const,
        categoryId: stakeholderCategory.id,
      },
      {
        name: 'e-Wakili',
        slug: 'e-wakili',
        url: 'https://ewakili.judiciary.go.tz/',
        desc: 'Digital platform for Registring and managing Advocates',
        iconName: 'FaUserTie',
        status: 'online' as const,
        permit: 'internal' as const,
        categoryId: stakeholderCategory.id,
      },
      {
        name: 'TANZLII',
        slug: 'tanzlii',
        url: 'https://tanzlii.org/en/',
        desc: 'Legal Resources Library',
        iconName: 'FaBookOpen',
        status: 'online' as const,
        permit: 'external' as const,
        categoryId: stakeholderCategory.id,
      },

      {
        name: 'Employee Self Service',
        slug: 'employee-self-service',
        url: 'https://ess.utumishi.go.tz/sessions/signin',
        desc: 'System to monitor employees performances',
        iconName: 'FaBalanceScale',
        status: 'online' as const,
        permit: 'external' as const,
        categoryId: externalCategory.id,
      },
      {
        name: 'GePG',
        slug: 'gepg',
        url: 'https://billing.gepg.go.tz/',
        desc: 'Government e-Payment Gateway for online payments',
        iconName: 'FaMoneyBillWave',
        status: 'online' as const,
        permit: 'external' as const,
        categoryId: externalCategory.id,
      },
      {
        name: 'Muse',
        slug: 'muse',
        url: '',
        desc: '',
        iconName: 'FaBook',
        status: 'online' as const,
        permit: 'external' as const,
        categoryId: externalCategory.id,
      },
      {
        name: 'e-Office',
        slug: 'eoffice',
        url: 'https://eoffice.judiciary.go.tz/login',
        desc: 'Tanzania Judiciary Official e-Office system',
        iconName: 'FaUniversity',
        status: 'online' as const,
        permit: 'internal' as const,
        categoryId: externalCategory.id,
      },
    ];

    await prisma.link.deleteMany({});

    for (const link of linksData) {
      await prisma.link.upsert({
        where: { slug: link.slug },
        update: {
          name: link.name,
          url: link.url,
          desc: link.desc,
          iconName: link.iconName,
          status: link.status,
          permit: link.permit,
          categoryId: link.categoryId,
        },
        create: link,
      });
    }

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();