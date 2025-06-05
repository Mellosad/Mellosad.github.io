// 전역 변수
let particlesArray = [];
let mouse = { x: null, y: null, radius: 150 };
let currentProjectImageId = null;
let certificationCounter = 4;
let projectCounter = 2;
let autoTranslateEnabled = false;

// API Gateway 엔드포인트 URL
const GET_CONTENT_ENDPOINT = 'https://f34s9za735.execute-api.ap-northeast-2.amazonaws.com/prod/get-content';
const TRANSLATE_ENDPOINT = 'https://f34s9za735.execute-api.ap-northeast-2.amazonaws.com/prod/translate-text';

// S3 버킷 정보
const S3_BUCKET_URL = 'https://ys-portpolio.s3.ap-northeast-2.amazonaws.com';

// 고정 이미지 URL 설정
const FIXED_IMAGES = {
    profile: 'https://ys-portpolio.s3.ap-northeast-2.amazonaws.com/images/profile-image.JPG',
    project1: 'https://ys-portpolio.s3.ap-northeast-2.amazonaws.com/images/project1-image.png',
    project2: 'https://ys-portpolio.s3.ap-northeast-2.amazonaws.com/images/project2-image.png'
};

// 언어별 파일 경로 매핑
const filePathMapping = {
    resume: {
        ko: 'ko_resume.pdf',
        en: 'en_resume.pdf', 
        ja: 'jp_resume.pdf'
    },
    coverLetter: {
        ko: 'ko_cover_letter.pdf',
        en: 'en_cover_letter.pdf',
        ja: 'jp_cover_letter.pdf'
    }
};

// 언어별 파일명 매핑
const fileNameMapping = {
    resume: {
        ko: '박진우_이력서.pdf',
        en: 'Park_Jinwoo_Resume.pdf',
        ja: 'パク・ジヌ_履歴書.pdf'
    },
    coverLetter: {
        ko: '박진우_자기소개서.pdf', 
        en: 'Park_Jinwoo_Cover_Letter.pdf',
        ja: 'パク・ジヌ_志望動機書.pdf'
    }
};

// 번역 캐시
const translationCache = {};

// 다국어 번역 데이터
const translations = {
    ko: {
        // Navigation
        navAbout: "About",
        navSkills: "Skills", 
        navExperience: "Experience",
        navProjects: "Projects",
        navDownloads: "Downloads",
        navContact: "Contact",
        
        // Hero Section
        heroTitle: "박진우",
        heroSubtitle: "Cloud Engineer",
        heroDescription: "AWS 클라우드 서비스를 활용한 웹 애플리케이션<br>의 성공적인 수동 배포 경험",
        heroAboutBtn: "About Me",
        heroProjectsBtn: "Projects",
        downloadResume: "Resume",
        profileStatus: "현재 구직중",
        scrollDown: "Scroll Down",
        loadingText: "포트폴리오 로딩 중",
        clickToChange: "클릭하여 변경",
        
        // About Section
        aboutTitle: "About Me",
        aboutSubtitle: "저에 대해 소개합니다",
        aboutDescription: "안녕하세요! 클라우드 엔지니어를 꿈꾸는 신입 개발자 박진우입니다. AWS 클라우드 서비스를 활용하여 웹 애플리케이션을 배포하고 관리하는 경험을 쌓고 있으며, 서버리스 아키텍처와 DevOps에 깊은 관심을 가지고 있습니다.",
        yearsExpLabel: "Years Experience",
        projectsCompletedLabel: "Projects Completed", 
        technologiesLabel: "Technologies",
        
        // Skills Section
        skillsTitle: "Certifications & Skills",
        skillsSubtitle: "보유하고 있는 자격증과 기술 스택입니다",
        cloudDevopsTitle: "Cloud & DevOps",
        certificationsTitle: "Certifications",
        addCertBtn: "자격증 추가",
        
        // Experience Section
        expTitle: "Work Experience",
        expSubtitle: "주요 경력 사항",
        
        // Projects Section
        projectsTitle: "Featured Projects",
        projectsSubtitle: "주요 프로젝트를 소개합니다",
        addProjectBtn: "프로젝트 추가",
        filterAll: "All",
        filterWeb: "Web App",
        filterCloud: "Cloud",
        filterMobile: "Mobile",
        filterApi: "API",
        projectFeaturesTitle: "주요 기능",
        projectTechTitle: "사용 기술",
        projectChallengesTitle: "주요 도전과제",
        projectResultsTitle: "프로젝트 성과",
        
        // 프로젝트 1 상세 정보
        project1Feature1: "JSP/Servlet 기반 웹 애플리케이션 개발",
        project1Feature2: "CSS/JavaScript를 활용한 프론트엔드 구현",
        project1Feature3: "AWS EC2 단일 인스턴스 배포",
        project1Feature4: "비영리 단체 웹사이트 운영",
        project1Feature5: "서버리스 아키텍처 이전 계획",
        project1Feature6: "웹사이트 유지보수 및 관리",
        
        project1Challenge1: "EC2 인스턴스 설정 및 배포 환경 구축",
        project1Challenge2: "웹 애플리케이션 성능 최적화",
        project1Challenge3: "서버리스 아키텍처 마이그레이션 계획 수립",
        
        project1Result1: "안정적인 웹사이트 운영",
        project1Result2: "AWS 클라우드 배포 경험 습득",
        project1Result3: "서버리스 아키텍처 이해도 향상",
        
        project1Duration: "3개월",
        project1Team: "1명",
                // 프로젝트 2 상세 정보
        project2Feature1: "서버리스 아키텍처 구현",
        project2Feature2: "AWS Lambda를 활용한 백엔드 API",
        project2Feature3: "S3 정적 웹사이트 호스팅",
        project2Feature4: "DynamoDB를 활용한 데이터 관리",
        project2Feature5: "API Gateway를 통한 API 관리",
        project2Feature6: "다국어 지원 시스템",
        
        project2Challenge1: "서버리스 아키텍처 설계 및 구현",
        project2Challenge2: "AWS 서비스 간 연동 및 보안 설정",
        project2Challenge3: "다국어 번역 시스템 구축",
        
        project2Result1: "완전 서버리스 포트폴리오 구축",
        project2Result2: "AWS 프리티어 한도 내 운영",
        project2Result3: "실시간 콘텐츠 관리 시스템 구현",
        
        project2Duration: "7일",
        project2Team: "1명",

        // Downloads 섹션
        downloadsTitle: "Downloads",
        downloadsSubtitle: "이력서와 자기소개서를 다운로드하세요",
        resumeTitle: "이력서",
        resumeDesc: "박진우의 상세한 이력서를 다운로드하세요",
        coverLetterTitle: "자기소개서",
        coverLetterDesc: "지원 동기와 포부가 담긴 자기소개서입니다",
        downloadBtn: "다운로드",
        
        // Contact Section
        contactTitle: "Get In Touch",
        contactSubtitle: "언제든지 연락주세요",
        contactWorkTogether: "Let's Work Together",
        contactIntro: "새로운 프로젝트나 협업 기회에 대해 이야기해보세요.",
        
        // Footer
        footerRights: "All rights reserved.",
        
        // Notifications
        notifLanguageChanged: "언어가 변경되었습니다.",
        notifTranslating: "번역 중입니다...",
        notifTranslated: "번역이 완료되었습니다.",
        
        // 다운로드 관련
        notifResumeDownload: "이력서 다운로드가 시작되었습니다.",
        notifCoverLetterDownload: "자기소개서 다운로드가 시작되었습니다.",
        notifFileNotFound: "해당 언어의 파일을 찾을 수 없습니다.",
        notifFallbackDownload: "해당 언어 파일이 없어 한국어 버전을 다운로드합니다.",
        
        // 자격증 번역
        cert1Name: "JPT 655점",
        cert1Issuer: "일본어능력시험",
        cert1Date: "2023.08",
        cert2Name: "TOEIC SPEAKING IM",
        cert2Issuer: "ETS",
        cert2Date: "2023.10",
        cert3Name: "SQLD",
        cert3Issuer: "한국데이터산업진흥원",
        cert3Date: "2023.09",
        cert4Name: "TOEIC 850",
        cert4Issuer: "ETS",
        cert4Date: "2023.12",
        
        // 경험 번역
        exp1Title: "비영리 단체 CHACKUS",
        exp1Company: "AWS 운영 및 관리",
        exp1Desc: "AWS, GCP 클라우드 서비스 관리 및 운영을 담당하고 있으며 현재 웹 애플리케이션 제작 및 관리를 담당하고 있습니다.",
        exp1Item1: "(초기)JSP/Servlet 기반 웹 애플리케이션 개발 및 배포",
        exp1Item2: "AWS EC2 인스턴스 설정 및 배포",
        exp1Item3: "서버리스 아키텍처 설계 및 구현",
        exp1Item4: "체커스에 관하여 \"Chackus.com\"",
        
        // 프로젝트 번역
        project1Title: "체커스 웹페이지 제작 배포",
        project1Desc: "JSP, Servlet, CSS, JavaScript를 사용하여 비영리 단체 웹페이지를 제작하고 AWS EC2 단일 인스턴스로 배포 중이며, 서버리스 아키텍처로 이전 계획 중입니다.",
        project1Tag1: "JSP",
        project1Tag2: "Servlet", 
        project1Tag3: "AWS EC2",
        project1Tag4: "CSS",
        
        project2Title: "포트폴리오 페이지 제작 배포",
        project2Desc: "서버리스 아키텍처를 활용한 개인 포트폴리오 웹사이트로 AWS Lambda, S3, DynamoDB, API Gateway를 사용하여 구축하였습니다.",
        project2Tag1: "AWS Lambda",
        project2Tag2: "S3",
        project2Tag3: "DynamoDB", 
        project2Tag4: "JavaScript"
    },
    
    en: {
        // Navigation
        navAbout: "About",
        navSkills: "Skills",
        navExperience: "Experience", 
        navProjects: "Projects",
        navDownloads: "Downloads",
        navContact: "Contact",
        
        // Hero Section
        heroTitle: "Park Jinwoo",
        heroSubtitle: "Cloud Engineer",
        heroDescription: "Successful manual deployment experience of web applications<br>using AWS cloud services",
        heroAboutBtn: "About Me",
        heroProjectsBtn: "Projects", 
        downloadResume: "Resume",
        profileStatus: "Currently Job Seeking",
        scrollDown: "Scroll Down",
        loadingText: "Loading Portfolio",
        clickToChange: "Click to Change",
        
        // About Section
        aboutTitle: "About Me",
        aboutSubtitle: "Introduction about myself",
        aboutDescription: "Hello! I'm Park Jinwoo, a junior developer aspiring to be a cloud engineer. I'm gaining experience in deploying and managing web applications using AWS cloud services, and I have a deep interest in serverless architecture and DevOps.",
        yearsExpLabel: "Years Experience",
        projectsCompletedLabel: "Projects Completed",
        technologiesLabel: "Technologies",
        
        // Skills Section
        skillsTitle: "Certifications & Skills", 
        skillsSubtitle: "My certifications and technical skills",
        cloudDevopsTitle: "Cloud & DevOps",
        certificationsTitle: "Certifications",
        addCertBtn: "Add Certification",
        
        // Experience Section
        expTitle: "Work Experience",
        expSubtitle: "Key career highlights",
        
        // Projects Section
        projectsTitle: "Featured Projects",
        projectsSubtitle: "Showcasing my key projects",
        addProjectBtn: "Add Project",
        filterAll: "All",
        filterWeb: "Web App", 
        filterCloud: "Cloud",
        filterMobile: "Mobile",
        filterApi: "API",
        

        // 프로젝트 모달 섹션 제목
        projectFeaturesTitle: "Key Features",
        projectTechTitle: "Technologies Used",
        projectChallengesTitle: "Main Challenges",
        projectResultsTitle: "Project Results",
        
        // 프로젝트 1 상세 정보
        project1Feature1: "JSP/Servlet-based web application development",
        project1Feature2: "Frontend implementation using CSS/JavaScript",
        project1Feature3: "AWS EC2 single instance deployment",
        project1Feature4: "Non-profit organization website operation",
        project1Feature5: "Serverless architecture migration planning",
        project1Feature6: "Website maintenance and management",
        
        project1Challenge1: "EC2 instance setup and deployment environment construction",
        project1Challenge2: "Web application performance optimization",
        project1Challenge3: "Serverless architecture migration planning",
        
        project1Result1: "Stable website operation",
        project1Result2: "AWS cloud deployment experience acquisition",
        project1Result3: "Improved understanding of serverless architecture",
        
        project1Duration: "2 months",
        project1Team: "1 person",
        
        // 프로젝트 2 상세 정보
        project2Feature1: "Serverless architecture implementation",
        project2Feature2: "Backend API using AWS Lambda",
        project2Feature3: "S3 static website hosting",
        project2Feature4: "Data management using DynamoDB",
        project2Feature5: "API management through API Gateway",
        project2Feature6: "Multi-language support system",
        
        project2Challenge1: "Serverless architecture design and implementation",
        project2Challenge2: "AWS service integration and security configuration",
        project2Challenge3: "Multi-language translation system construction",
        
        project2Result1: "Complete serverless portfolio construction",
        project2Result2: "Operation within AWS free tier limits",
        project2Result3: "Real-time content management system implementation",
        
        project2Duration: "7days",
        project2Team: "1 person",

        // Downloads 섹션
        downloadsTitle: "Downloads",
        downloadsSubtitle: "Download resume and cover letter",
        resumeTitle: "Resume",
        resumeDesc: "Download Park Jinwoo's detailed resume",
        coverLetterTitle: "Cover Letter",
        coverLetterDesc: "Cover letter with motivation and aspirations",
        downloadBtn: "Download",
        
        // Contact Section
        contactTitle: "Get In Touch",
        contactSubtitle: "Feel free to contact me anytime",
        contactWorkTogether: "Let's Work Together",
        contactIntro: "Let's discuss new projects or collaboration opportunities.",
        
        // Footer
        footerRights: "All rights reserved.",
        
        // Notifications
        notifLanguageChanged: "Language changed successfully!",
        notifTranslating: "Translating...",
        notifTranslated: "Translation completed.",
        
        // 다운로드 관련
        notifResumeDownload: "Resume download started.",
        notifCoverLetterDownload: "Cover letter download started.",
        notifFileNotFound: "File not found for the selected language.",
        notifFallbackDownload: "File not available in selected language. Downloading Korean version.",
        
        // 자격증 영어 번역
        cert1Name: "JPT 655 Points",
        cert1Issuer: "Japanese Proficiency Test",
        cert1Date: "2023.08",
        cert2Name: "TOEIC SPEAKING IM",
        cert2Issuer: "ETS",
        cert2Date: "2023.10",
        cert3Name: "SQL Developer",
        cert3Issuer: "Korea Data Agency",
        cert3Date: "2023.09",
        cert4Name: "TOEIC 850",
        cert4Issuer: "ETS",
        cert4Date: "2023.12",
        
        // 경험 영어 번역
        expTitle: "Work Experience",
        expSubtitle: "Main Career",
        exp1Title: "Non-profit Organization CHACKUS",
        exp1Company: "AWS Operation & Management",
        exp1Desc: "Responsible for managing and operating AWS and GCP cloud services, currently in charge of web application production and management.",
        exp1Item1: "(Initial) Developed and deployed JSP/Servlet-based web applications",
        exp1Item2: "Configured and deployed AWS EC2 instances",
        exp1Item3: "Designed and implemented serverless architecture",
        exp1Item4: "About Chackus at \"Chackus.com\"",
        // 프로젝트 영어 번역
        project1Title: "Checkers Website Development & Deployment",
        project1Desc: "Created a non-profit organization website using JSP, Servlet, CSS, JavaScript and deployed it on AWS EC2 single instance, planning to migrate to serverless architecture.",
        project1Tag1: "JSP",
        project1Tag2: "Servlet",
        project1Tag3: "AWS EC2", 
        project1Tag4: "CSS",
        
        project2Title: "Portfolio Website Development & Deployment",
        project2Desc: "Built a personal portfolio website using serverless architecture with AWS Lambda, S3, DynamoDB, and API Gateway.",
        project2Tag1: "AWS Lambda",
        project2Tag2: "S3",
        project2Tag3: "DynamoDB",
        project2Tag4: "JavaScript"
    },
    
    ja: {
        // Navigation
        navAbout: "私について",
        navSkills: "スキル",
        navExperience: "経験",
        navProjects: "プロジェクト", 
        navDownloads: "ダウンロード",
        navContact: "お問い合わせ",
        
        // Hero Section
        heroTitle: "パク・ジヌ",
        heroSubtitle: "クラウドエンジニア",
        heroDescription: "AWSクラウドサービスを活用したWebアプリケーション<br>の成功的な手動デプロイ経験",
        heroAboutBtn: "私について",
        heroProjectsBtn: "プロジェクト",
        downloadResume: "履歴書",
        profileStatus: "現在求職中",
        scrollDown: "スクロールダウン",
        loadingText: "ポートフォリオ読み込み中",
        clickToChange: "クリックして変更",
        
        // About Section
        aboutTitle: "私について",
        aboutSubtitle: "自己紹介",
        aboutDescription: "こんにちは！クラウドエンジニアを目指すジュニア開発者のパク・ジヌです。AWSクラウドサービスを活用してWebアプリケーションをデプロイ・管理する経験を積んでおり、サーバーレスアーキテクチャとDevOpsに深い関心を持っています。",
        yearsExpLabel: "年間経験",
        projectsCompletedLabel: "完了プロジェクト",
        technologiesLabel: "技術",
        
        // Skills Section
        skillsTitle: "資格とスキル",
        skillsSubtitle: "保有している資格と技術スタック",
        cloudDevopsTitle: "クラウド & DevOps",
        certificationsTitle: "資格",
        addCertBtn: "資格追加",
        
        // Experience Section
        expTitle: "職歴",
        expSubtitle: "主要キャリア事項",
        
        // Projects Section
        projectsTitle: "主要プロジェクト",
        projectsSubtitle: "主要プロジェクトをご紹介します",
        addProjectBtn: "プロジェクト追加",
        filterAll: "すべて",
        filterWeb: "Webアプリ",
        filterCloud: "クラウド",
        filterMobile: "モバイル",
        filterApi: "API",

        projectFeaturesTitle: "主要機能",
        projectTechTitle: "使用技術",
        projectChallengesTitle: "主な課題",
        projectResultsTitle: "プロジェクト成果",
        
        // 프로젝트 1 상세 정보
        project1Feature1: "JSP/ServletベースのWebアプリケーション開発",
        project1Feature2: "CSS/JavaScriptを活用したフロントエンド実装",
        project1Feature3: "AWS EC2単一インスタンスデプロイ",
        project1Feature4: "非営利団体Webサイト運営",
        project1Feature5: "サーバーレスアーキテクチャ移行計画",
        project1Feature6: "Webサイトメンテナンスと管理",
        
        project1Challenge1: "EC2インスタンス設定とデプロイ環境構築",
        project1Challenge2: "Webアプリケーション性能最適化",
        project1Challenge3: "サーバーレスアーキテクチャマイグレーション計画策定",
        
        project1Result1: "安定したWebサイト運営",
        project1Result2: "AWSクラウドデプロイ経験習得",
        project1Result3: "サーバーレスアーキテクチャ理解度向上",
        
        project1Duration: "3ヶ月",
        project1Team: "1名",
        
        // 프로젝트 2 상세 정보
        project2Feature1: "サーバーレスアーキテクチャ実装",
        project2Feature2: "AWS Lambdaを活用したバックエンドAPI",
        project2Feature3: "S3静的Webサイトホスティング",
        project2Feature4: "DynamoDBを活用したデータ管理",
        project2Feature5: "API Gatewayを通じたAPI管理",
        project2Feature6: "多言語サポートシステム",
        
        project2Challenge1: "サーバーレスアーキテクチャ設計と実装",
        project2Challenge2: "AWSサービス間連携とセキュリティ設定",
        project2Challenge3: "多言語翻訳システム構築",
        
        project2Result1: "完全サーバーレスポートフォリオ構築",
        project2Result2: "AWS無料枠内での運営",
        project2Result3: "リアルタイムコンテンツ管理システム実装",
        
        project2Duration: "7日",
        project2Team: "1名",

        
        // Downloads 섹션
        downloadsTitle: "ダウンロード",
        downloadsSubtitle: "履歴書と志望動機書をダウンロード",
        resumeTitle: "履歴書",
        resumeDesc: "パク・ジヌの詳細な履歴書をダウンロード",
        coverLetterTitle: "志望動機書",
        coverLetterDesc: "志望動機と抱負が込められた志望動機書",
        downloadBtn: "ダウンロード",
        
        // Contact Section
        contactTitle: "お問い合わせ",
        contactSubtitle: "いつでもお気軽にご連絡ください",
        contactWorkTogether: "一緒に働きましょう",
        contactIntro: "新しいプロジェクトやコラボレーションの機会についてお話ししましょう。",
        
        // Footer
        footerRights: "All rights reserved.",
        
        // Notifications
        notifLanguageChanged: "言語が変更されました。",
        notifTranslating: "翻訳中です...",
        notifTranslated: "翻訳が完了しました。",
        
        // 다운로드 관련
        notifResumeDownload: "履歴書のダウンロードが開始されました。",
        notifCoverLetterDownload: "志望動機書のダウンロードが開始されました。",
        notifFileNotFound: "選択した言語のファイルが見つかりません。",
        notifFallbackDownload: "選択した言語のファイルがないため、韓国語版をダウンロードします。",
        
        // 자격증 일본어 번역
        cert1Name: "JPT 655点",
        cert1Issuer: "日本語能力試験",
        cert1Date: "2023.08",
        cert2Name: "TOEIC SPEAKING IM",
        cert2Issuer: "ETS",
        cert2Date: "2023.10",
        cert3Name: "SQL開発者",
        cert3Issuer: "韓国データ産業振興院",
        cert3Date: "2023.09",
        cert4Name: "TOEIC 850",
        cert4Issuer: "ETS", 
        cert4Date: "2023.12",
        
        // 경험 일본어 번역
        expTitle: "職務経歴",
        expSubtitle: "主な経歴",
        exp1Title: "非営利団体CHACKUS",
        exp1Company: "AWS運用および管理",
        exp1Desc: "AWS、GCPクラウドサービスの管理・運用を担当し、現在はWebアプリケーションの制作と管理を担当しています。",
        exp1Item1: "（初期）JSP/ServletベースのWebアプリケーション開発とデプロイ",
        exp1Item2: "AWS EC2インスタンスの設定とデプロイ",
        exp1Item3: "サーバーレスアーキテクチャの設計と実装",
        exp1Item4: "Chackusについて「Chackus.com」",
        // 프로젝트 일본어 번역
        project1Title: "チェッカーズWebページ制作・デプロイ",
        project1Desc: "JSP、Servlet、CSS、JavaScriptを使用して非営利団体Webページを制作し、AWS EC2単一インスタンスでデプロイ中で、サーバーレスアーキテクチャへの移行を計画中です。",
        project1Tag1: "JSP",
        project1Tag2: "Servlet",
        project1Tag3: "AWS EC2",
        project1Tag4: "CSS",
        
        project2Title: "ポートフォリオページ制作・デプロイ", 
        project2Desc: "サーバーレスアーキテクチャを活用した個人ポートフォリオWebサイトでAWS Lambda、S3、DynamoDB、API Gatewayを使用して構築しました。",
        project2Tag1: "AWS Lambda",
        project2Tag2: "S3",
        project2Tag3: "DynamoDB",
        project2Tag4: "JavaScript"
    }
};

// 현재 언어 상태
let currentLanguage = localStorage.getItem('language') || 'ko';

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// 웹사이트 초기화
function initializeWebsite() {
    // 로딩 스피너 제거
    setTimeout(() => {
        document.getElementById('loading-spinner').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loading-spinner').style.display = 'none';
            document.getElementById('main-container').classList.add('loaded');
        }, 500);
    }, 2000);

    // 각종 기능 초기화
    initializeTheme();
    initializeLanguage();
    initializeParticles();
    initializeScrollAnimations();
    initializeSkillBars();
    initializeCounters();
    initializeAboutDescription();
    initializeSmoothScroll();
    initializeScrollProgress();
    initializeNavbar();
    initializeProjectFilter();
    
    // 고정 이미지 설정
    setFixedImages();
    
    // 서버에서 콘텐츠 로드
    loadContentFromServer();
    
    // 기본 보안 기능
    initializeBasicSecurity();
}

// 고정 이미지 설정 함수
function setFixedImages() {
    // 프로필 이미지 설정
    const profileImg = document.getElementById('profile-img');
    if (profileImg) {
        profileImg.src = FIXED_IMAGES.profile;
    }
    
    // 프로젝트 이미지 설정
    const project1Img = document.querySelector('[data-project-id="project1"] img');
    if (project1Img) {
        project1Img.src = FIXED_IMAGES.project1;
    }
    
    const project2Img = document.querySelector('[data-project-id="project2"] img');
    if (project2Img) {
        project2Img.src = FIXED_IMAGES.project2;
    }
}

// 안전한 fetch 함수
async function safeFetch(url, options = {}) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return response;
    } catch (error) {
        console.error(`Fetch failed for ${url}: ${error.message}`);
        throw error;
    }
}

// 네비게이션 바 스크롤 효과
function initializeNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;
    let isScrolling = false;

    function updateNavbar() {
        const currentScrollY = window.scrollY;
        const currentTheme = document.documentElement.getAttribute('data-theme');

        if (currentScrollY > 100) {
            navbar.classList.add('scrolled');
            
            if (currentScrollY > lastScrollY && currentScrollY > 150) {
                navbar.style.transform = 'translateY(-100%)';
                navbar.style.opacity = '0';
            } else if (currentScrollY < lastScrollY) {
                navbar.style.transform = 'translateY(0)';
                navbar.style.opacity = '1';
            }

            if (currentTheme === 'dark') {
                navbar.style.background = 'rgba(45, 55, 72, 0.95)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            }
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.transform = 'translateY(0)';
            navbar.style.opacity = '1';
            navbar.style.background = 'transparent';
            navbar.style.backdropFilter = 'none';
        }

        lastScrollY = currentScrollY;
        isScrolling = false;
    }

    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(updateNavbar);
            isScrolling = true;
        }
    });

    updateNavbar();
}

// 언어 관련 함수들
function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    updateTranslations();
    updateLanguageButtons();
    updateCurrentLanguageDisplay();
    
    showNotification(getTranslation('notifLanguageChanged') || 'Language changed successfully!');
}

function getTranslation(key) {
    const serverKey = `${key}_${currentLanguage}`;
    const serverData = localStorage.getItem(`server_${serverKey}`);
    
    if (serverData) {
        return serverData;
    }
    
    return translations[currentLanguage] && translations[currentLanguage][key] 
        ? translations[currentLanguage][key] 
        : translations['ko'][key] || key;
}

function updateTranslations() {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        const translation = getTranslation(key);
        
        if (translation) {
            if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'email')) {
                element.placeholder = translation;
            } else if (element.tagName === 'INPUT' && element.type === 'password') {
                element.placeholder = translation;
            } else if (element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.innerHTML = translation;
            }
        }
    });
    
    updateSpecialElements();
}

function updateSpecialElements() {
    document.title = getTranslation('heroTitle') + ' - ' + getTranslation('heroSubtitle');
    
    const buttons = {
        'hero-about-btn': 'heroAboutBtn',
        'hero-projects-btn': 'heroProjectsBtn', 
        'hero-resume-btn': 'downloadResume'
    };
    
    Object.entries(buttons).forEach(([id, key]) => {
        const element = document.getElementById(id);
        if (element) {
            const span = element.querySelector('span');
            if (span) {
                span.textContent = getTranslation(key);
            }
        }
    });
}

function updateLanguageButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === currentLanguage) {
            btn.classList.add('active');
        }
    });
}

function updateCurrentLanguageDisplay() {
    const currentLangElement = document.getElementById('current-lang');
    const langNames = {
        ko: '한국어',
        en: 'English',
        ja: '日本語'
    };
    
    if (currentLangElement) {
        currentLangElement.textContent = langNames[currentLanguage] || '한국어';
    }
}

function initializeLanguage() {
    updateTranslations();
    updateLanguageButtons();
    updateCurrentLanguageDisplay();
}

// 서버에서 콘텐츠 로드
async function loadContentFromServer() {
    try {
        const response = await safeFetch(GET_CONTENT_ENDPOINT);
        const result = await response.json();
        
        if (result.success && result.content) {
            Object.entries(result.content).forEach(([key, data]) => {
                localStorage.setItem(`server_${key}`, data.value);
                
                const baseKey = key.replace(/_ko$|_en$|_ja$/, '');
                const langSuffix = key.match(/_ko$|_en$|_ja$/);
                
                if (!langSuffix || langSuffix[0] === `_${currentLanguage}`) {
                    const element = document.querySelector(`[data-key="${baseKey}"]`);
                    if (element) {
                        if (data.type === 'image') {
                            if (element.tagName === 'IMG') {
                                element.src = data.value;
                            }
                        } else {
                            element.textContent = data.value;
                        }
                    }
                }
            });
            
            console.log('Content loaded from server:', Object.keys(result.content).length, 'items');
        }
    } catch (error) {
        console.error('Failed to load content from server:', error);
        loadSavedData();
    }
}

// 이력서 다운로드 함수 수정
function downloadResume() {
    const fileName = filePathMapping.resume[currentLanguage];
    const downloadName = fileNameMapping.resume[currentLanguage];
    
    if (!fileName) {
        showNotification(getTranslation('notifFileNotFound') || '해당 언어의 파일을 찾을 수 없습니다.', 'error');
        return;
    }
    
    // fetch를 사용하여 파일을 blob으로 다운로드
    fetch(`${S3_BUCKET_URL}/files/${fileName}`)
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = downloadName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('다운로드 오류:', error);
            // 실패 시 기존 방식으로 폴백
            const link = document.createElement('a');
            link.href = `${S3_BUCKET_URL}/files/${fileName}`;
            link.download = downloadName;
            link.target = '_blank';
            link.click();
        });
    
    const message = getTranslation('notifResumeDownload') || '이력서 다운로드가 시작되었습니다.';
    showNotification(message);
}

// 자기소개서 다운로드 함수 수정
function downloadCoverLetter() {
    const fileName = filePathMapping.coverLetter[currentLanguage];
    const downloadName = fileNameMapping.coverLetter[currentLanguage];
    
    if (!fileName) {
        showNotification(getTranslation('notifFileNotFound') || '해당 언어의 파일을 찾을 수 없습니다.', 'error');
        return;
    }
    
    // fetch를 사용하여 파일을 blob으로 다운로드
    fetch(`${S3_BUCKET_URL}/files/${fileName}`)
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = downloadName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('다운로드 오류:', error);
            // 실패 시 기존 방식으로 폴백
            const link = document.createElement('a');
            link.href = `${S3_BUCKET_URL}/files/${fileName}`;
            link.download = downloadName;
            link.target = '_blank';
            link.click();
        });
    
    const message = getTranslation('notifCoverLetterDownload') || '자기소개서 다운로드가 시작되었습니다.';
    showNotification(message);
}


// 테마 관리
function initializeTheme() {
    const themeBtn = document.getElementById('theme-btn');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    updateNavbarTheme(currentTheme);
    
    themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        updateNavbarTheme(newTheme);
        
        themeBtn.style.transform = 'scale(0.8)';
        setTimeout(() => {
            themeBtn.style.transform = 'scale(1)';
        }, 200);
    });
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#theme-btn i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    clearNavbarInlineStyles();
}

function updateNavbarTheme(theme) {
    const navbar = document.getElementById('navbar');
    const scrollY = window.scrollY;
    
    if (scrollY > 100) {
        if (theme === 'dark') {
            navbar.style.background = 'rgba(45, 55, 72, 0.95)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    }
}

function clearNavbarInlineStyles() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY <= 100) {
        navbar.style.removeProperty('background');
        navbar.style.removeProperty('background-color');
    }
}

// 스크롤 진행률 표시
function initializeScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    
    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// 모바일 메뉴 토글
function toggleMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
}

// 프로젝트 필터 기능
function initializeProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// 파티클 시스템 - 수정된 부분
function initializeParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });
    
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });
    
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        
        update() {
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }
            
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius && mouse.x != null && mouse.y != null) {
                if (distance < mouse.radius / 2) {
                    this.x -= dx / 20;
                    this.y -= dy / 20;
                }
            }
            
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }
    
    function createParticles() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 10000; // 파티클 수 감소
        
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 1) + 0.5; // 크기 감소
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 2) - 1; // 속도 감소
            let directionY = (Math.random() * 2) - 1; // 속도 감소
            let color = 'rgba(102, 126, 234, 0.8)'; // 투명도 감소
            
            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }
    
    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                
                if (distance < (canvas.width / 9) * (canvas.height / 9)) { // 연결선 감소
                    opacityValue = 1 - (distance / 25000);
                    ctx.strokeStyle = `rgba(102, 126, 234, ${opacityValue * 0.2})`; // 투명도 감소
                    ctx.lineWidth = 0.8; // 선 두께 감소
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }
    
    window.addEventListener('resize', () => {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        mouse.radius = ((canvas.height / 80) * (canvas.width / 80));
        createParticles();
    });
    
    createParticles();
    animate();
}

// 스크롤 애니메이션
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.project-card, .skill-category, .stat-item, .contact-item, .experience-item, .certification-item, .download-card').forEach(el => {
        observer.observe(el);
    });
}

// 스킬 바 애니메이션
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const targetWidth = progressBar.getAttribute('data-width');
                
                setTimeout(() => {
                    progressBar.style.width = targetWidth;
                }, 500);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => skillObserver.observe(bar));
}

// 카운터 애니메이션
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target')) || parseInt(counter.textContent);
                const increment = target / 100;
                let current = 0;
                
                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        counter.textContent = Math.ceil(current);
                        setTimeout(updateCounter, 20);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

// About 설명 애니메이션
function initializeAboutDescription() {
    const aboutDescription = document.querySelector('.about-description');
    if (aboutDescription) {
        aboutDescription.style.opacity = '0';
        aboutDescription.style.transform = 'translateY(20px)';
        aboutDescription.style.transition = 'all 0.8s ease';
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        aboutDescription.style.opacity = '1';
                        aboutDescription.style.transform = 'translateY(0)';
                    }, 300);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(aboutDescription);
    }
}

// 스무스 스크롤
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// 기본 보안 기능
function initializeBasicSecurity() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && e.key === 'I') ||
            (e.ctrlKey && e.shiftKey && e.key === 'C') ||
            (e.ctrlKey && e.key === 'u') ||
            (e.metaKey && e.altKey && e.key === 'i') ||
            (e.metaKey && e.altKey && e.key === 'I') ||
            (e.metaKey && e.altKey && e.key === 'j') ||
            (e.metaKey && e.altKey && e.key === 'J') ||
            (e.metaKey && e.altKey && e.key === 'u') ||
            (e.metaKey && e.altKey && e.key === 'U')) {
            
            e.preventDefault();
            showNotification('개발자 도구 접근이 제한되었습니다.');
            return false;
        }
    });
    
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showNotification('우클릭이 비활성화되었습니다.');
    });
}

// 프로젝트 모달
// 프로젝트 모달
function openProjectModal(projectId) {
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    
    const projectData = {
        project1: {
            title: getTranslation('project1Title') || '체커스 웹페이지 제작 배포',
            description: getTranslation('project1Desc') || 'JSP, Servlet, CSS, JavaScript를 사용하여 비영리 단체 웹페이지를 제작하고 AWS EC2 단일 인스턴스로 배포 중이며, 서버리스 아키텍처로 이전 계획 중입니다.',
            image: FIXED_IMAGES.project1,
            features: [
                getTranslation('project1Feature1') || 'JSP/Servlet 기반 웹 애플리케이션 개발',
                getTranslation('project1Feature2') || 'CSS/JavaScript를 활용한 프론트엔드 구현',
                getTranslation('project1Feature3') || 'AWS EC2 단일 인스턴스 배포',
                getTranslation('project1Feature4') || '비영리 단체 웹사이트 운영',
                getTranslation('project1Feature5') || '서버리스 아키텍처 이전 계획',
                getTranslation('project1Feature6') || '웹사이트 유지보수 및 관리'
            ],
            technologies: ['JSP', 'Servlet', 'CSS', 'JavaScript', 'AWS EC2', 'Linux'],
            challenges: [
                getTranslation('project1Challenge1') || 'EC2 인스턴스 설정 및 배포 환경 구축',
                getTranslation('project1Challenge2') || '웹 애플리케이션 성능 최적화',
                getTranslation('project1Challenge3') || '서버리스 아키텍처 마이그레이션 계획 수립'
            ],
            results: [
                getTranslation('project1Result1') || '안정적인 웹사이트 운영',
                getTranslation('project1Result2') || 'AWS 클라우드 배포 경험 습득',
                getTranslation('project1Result3') || '서버리스 아키텍처 이해도 향상'
            ],
            duration: getTranslation('project1Duration') || '3개월',
            team: getTranslation('project1Team') || '1명'
        },
        project2: {
            title: getTranslation('project2Title') || '포트폴리오 페이지 제작 배포',
            description: getTranslation('project2Desc') || '서버리스 아키텍처를 활용한 개인 포트폴리오 웹사이트로 AWS Lambda, S3, DynamoDB, API Gateway를 사용하여 구축하였습니다.',
            image: FIXED_IMAGES.project2,
            features: [
                getTranslation('project2Feature1') || '서버리스 아키텍처 구현',
                getTranslation('project2Feature2') || 'AWS Lambda를 활용한 백엔드 API',
                getTranslation('project2Feature3') || 'S3 정적 웹사이트 호스팅',
                getTranslation('project2Feature4') || 'DynamoDB를 활용한 데이터 관리',
                getTranslation('project2Feature5') || 'API Gateway를 통한 API 관리',
                getTranslation('project2Feature6') || '다국어 지원 시스템'
            ],
            technologies: ['AWS Lambda', 'S3', 'DynamoDB', 'API Gateway', 'JavaScript', 'HTML/CSS'],
            challenges: [
                getTranslation('project2Challenge1') || '서버리스 아키텍처 설계 및 구현',
                getTranslation('project2Challenge2') || 'AWS 서비스 간 연동 및 보안 설정',
                getTranslation('project2Challenge3') || '다국어 번역 시스템 구축'
            ],
            results: [
                getTranslation('project2Result1') || '완전 서버리스 포트폴리오 구축',
                getTranslation('project2Result2') || 'AWS 프리티어 한도 내 운영',
                getTranslation('project2Result3') || '실시간 콘텐츠 관리 시스템 구현'
            ],
            duration: getTranslation('project2Duration') || '7일',
            team: getTranslation('project2Team') || '1명'
        }
    };
    
    const project = projectData[projectId];
    if (project) {
        modalBody.innerHTML = `
            <div class="project-modal-content">
                <div class="project-modal-header">
                    <img src="${project.image}" alt="${project.title}" class="project-modal-image">
                    <div class="project-modal-info">
                        <h2>${project.title}</h2>
                        <p class="project-modal-description">${project.description}</p>
                        <div class="project-modal-meta">
                            <span><i class="fas fa-clock"></i> <span>${project.duration}</span></span>
                            <span><i class="fas fa-users"></i> <span>${project.team}</span></span>
                        </div>
                    </div>
                </div>
                
                <div class="project-modal-body">
                    <div class="project-section">
                        <h3><i class="fas fa-list"></i> ${getTranslation('projectFeaturesTitle') || '주요 기능'}</h3>
                        <ul class="feature-list">
                            ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="project-section">
                        <h3><i class="fas fa-code"></i> ${getTranslation('projectTechTitle') || '사용 기술'}</h3>
                        <div class="tech-tags">
                            ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="project-section">
                        <h3><i class="fas fa-exclamation-triangle"></i> ${getTranslation('projectChallengesTitle') || '주요 도전과제'}</h3>
                        <ul class="challenge-list">
                            ${project.challenges.map(challenge => `<li>${challenge}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="project-section">
                        <h3><i class="fas fa-trophy"></i> ${getTranslation('projectResultsTitle') || '프로젝트 성과'}</h3>
                        <ul class="result-list">
                            ${project.results.map(result => `<li>${result}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                
                <!-- GitHub 보기와 라이브 데모 버튼 주석처리
                <div class="project-modal-footer">
                    <a href="${project.github}" target="_blank" class="btn btn-primary">
                        <i class="fab fa-github"></i> GitHub 보기
                    </a>
                    <a href="${project.demo}" target="_blank" class="btn btn-secondary">
                        <i class="fas fa-external-link-alt"></i> 라이브 데모
                    </a>
                </div>
                -->
            </div>
        `;
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}


function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function loadSavedData() {
    const savedImageUrl = localStorage.getItem('profileImageUrl') || localStorage.getItem('server_profileImageUrl');
    if (savedImageUrl) {
        document.getElementById('profile-img').src = savedImageUrl;
    }
    
    document.querySelectorAll('[data-project-id]').forEach(card => {
        const projectId = card.getAttribute('data-project-id');
        const savedImageUrl = localStorage.getItem(`projectImageUrl_${projectId}`) || 
                             localStorage.getItem(`server_projectImageUrl_${projectId}`);
        if (savedImageUrl) {
            const img = card.querySelector('img');
            if (img) img.src = savedImageUrl;
        }
    });
    
    document.querySelectorAll('[data-editable]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (key) {
            const savedContent = localStorage.getItem(`server_${key}_${currentLanguage}`) || 
                               localStorage.getItem(`server_${key}`) || 
                               localStorage.getItem(key);
            if (savedContent) {
                el.textContent = savedContent;
            }
        }
    });
}

// 알림 메시지
function showNotification(message, type = 'info') {
    const translatedMessage = translations[currentLanguage] && translations[currentLanguage][message] 
        ? translations[currentLanguage][message] 
        : message;
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? 'var(--danger-color)' : type === 'success' ? 'var(--success-color)' : type === 'warning' ? 'var(--warning-color)' : 'var(--primary-color)'};
        color: white;
        padding: 15px 25px;
        border-radius: var(--border-radius);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        box-shadow: var(--shadow-lg);
        max-width: 300px;
        word-wrap: break-word;
        font-weight: 500;
    `;
    notification.textContent = translatedMessage;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// 키보드 단축키
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProjectModal();
    }
    
    if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        document.getElementById('theme-btn').click();
    }
});

// 모달 외부 클릭 시 닫기
window.addEventListener('click', (e) => {
    const projectModal = document.getElementById('project-modal');
    
    if (e.target === projectModal) {
        closeProjectModal();
    }
});

// 언어 버튼 이벤트 리스너
document.addEventListener('DOMContentLoaded', function() {
    const languageBtn = document.getElementById('language-btn');
    if (languageBtn) {
        languageBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const menu = document.getElementById('language-menu');
            const isVisible = menu.style.opacity === '1';
            menu.style.opacity = isVisible ? '0' : '1';
            menu.style.visibility = isVisible ? 'hidden' : 'visible';
            menu.style.transform = isVisible ? 'translateY(-10px)' : 'translateY(0)';
        });
    }
    
    document.addEventListener('click', function() {
        const menu = document.getElementById('language-menu');
        if (menu) {
            menu.style.opacity = '0';
            menu.style.visibility = 'hidden';
            menu.style.transform = 'translateY(-10px)';
        }
    });
});


// 추가 CSS 애니메이션
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }

    .project-modal-content {
        max-height: 70vh;
        overflow-y: auto;
    }

    .project-modal-header {
        display: grid;
        grid-template-columns: 200px 1fr;
        gap: 30px;
        margin-bottom: 30px;
        align-items: start;
    }

    .project-modal-image {
        width: 100%;
        height: 150px;
        object-fit: cover;
        border-radius: var(--border-radius);
    }

    .project-modal-info h2 {
        color: var(--primary-color);
        margin-bottom: 15px;
    }

    .project-modal-description {
        color: var(--text-light);
        line-height: 1.6;
        margin-bottom: 15px;
    }

    .project-modal-meta {
        display: flex;
        gap: 20px;
        font-size: 0.9rem;
        color: var(--text-muted);
    }

    .project-modal-meta span {
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .project-section {
        margin-bottom: 30px;
    }

    .project-section h3 {
        color: var(--text-color);
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .feature-list, .challenge-list, .result-list {
        list-style: none;
        padding: 0;
    }

    .feature-list li, .challenge-list li, .result-list li {
        padding: 8px 0;
        padding-left: 20px;
        position: relative;
        color: var(--text-light);
        line-height: 1.5;
    }

    .feature-list li::before {
        content: '✓';
        position: absolute;
        left: 0;
        color: var(--success-color);
        font-weight: bold;
    }

    .challenge-list li::before {
        content: '⚡';
        position: absolute;
        left: 0;
        color: var(--warning-color);
    }

    .result-list li::before {
        content: '🎯';
        position: absolute;
        left: 0;
    }

    .tech-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    .tech-tag {
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 500;
    }

    .project-modal-footer {
        display: flex;
        gap: 15px;
        justify-content: center;
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid var(--border-color);
    }

    @media (max-width: 768px) {
        .project-modal-header {
            grid-template-columns: 1fr;
            text-align: center;
        }
        
        .project-modal-image {
            width: 100%;
            height: 200px;
        }
        
        .project-modal-footer {
            flex-direction: column;
        }
    }
`;
document.head.appendChild(additionalStyles);

// 에러 처리
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});
