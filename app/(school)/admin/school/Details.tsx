// Details.js
import React from 'react';
import ProfilePicture from './ProfilePicture';
import SchoolUpdate from './SchoolUpdate';

function Details({ datas, refetch, className, ...rest }) {
  return (
    <div
      className={`grid grid-cols-1 gap-6 md:grid-cols-12 ${className}`}
      {...rest}
    >
      <div className="col-span-1 md:col-span-4">
        <ProfilePicture datas={datas} refetch={refetch} />
      </div>
      <div className="col-span-1 md:col-span-8">
        <SchoolUpdate datas={datas} />
      </div>
    </div>
  );
}

export default Details;
