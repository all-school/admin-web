import Head from 'next/head';
import { NextSeo } from 'next-seo';
export default function HeadMetaSeo({
  title = 'Efficient School Management System for Streamlined Operations | All.School',
  description = 'All.School is a comprehensive school management system designed to streamline operations and improve efficiency. Our cloud-based platform provides a user-friendly interface for teachers, parents, and administrators to manage everything from attendance tracking to exam scheduling. With real-time updates and intuitive reporting, All.School enables seamless communication and collaboration among all stakeholders. Sign up now and experience the benefits of our efficient school management system.',
  keywords = 'School management system, Education technology, Cloud-based platform, Attendance tracking, Exam scheduling, Communication, Collaboration, Teacher portal, Parent portal, Administrative tools.'
}) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/school/logos/favicon_io/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/school/logos/favicon_io/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/school/logos/favicon_io/favicon-16x16.png"
        />
        <link rel="manifest" href="/school/logos/favicon_io/site.webmanifest" />

        <link rel="mask-icon" color="#5bbad5" href="safari-pinned-tab.svg" />
        <link rel="stylesheet" media="screen" href="/css/common.css" />
        <script src="/js/common.js"></script>
      </Head>
      {/*canonical='https://www.schoolmotors.in/'*/}

      <NextSeo
        title={title}
        description={description}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: keywords
          },
          {
            name: 'author',
            content: 'All.School'
          },
          {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1'
          },
          {
            name: 'theme-color',
            content: '#ffffff'
          },
          {
            name: 'msapplication-TileColor',
            content: '#766df4'
          }
        ]}
      />
      {/*SEO End*/}
    </>
  );
}
