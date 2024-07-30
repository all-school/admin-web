import React from 'react';
import UpdateSchool from './UpdateSchool';

function SchoolUpdate({ datas }) {
  return (
    <UpdateSchool
      schoolId={datas.id}
      schoolName={datas.name}
      schoolType={datas.type}
      schoolBoard={datas.board}
      schoolCity={datas.city}
      schoolCountry={datas.country}
      schoolContactNumber={datas.contactNumber}
      schoolContactEmail={datas.contactEmail}
      schoolheadTeacher={datas.headTeacher}
      schoolSubdomain={datas.subdomain}
      schoolTimezone={datas.timezone}
      caption={datas.caption}
    />
  );
}

export default SchoolUpdate;
