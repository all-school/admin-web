const countryFullList = [
  { countryName: '', countryValue: 'Country' },
  { countryName: 'Afghanistan', countryValue: 'Afghanistan' },
  { countryName: 'Åland Islands', countryValue: 'Åland Islands' },
  { countryName: 'Albania', countryValue: 'Albania' },
  { countryName: 'Algeria', countryValue: 'Algeria' },
  { countryName: 'American Samoa', countryValue: 'American Samoa' },
  { countryName: 'Andorra', countryValue: 'Andorra' },
  { countryName: 'Angola', countryValue: 'Angola' },
  { countryName: 'Anguilla', countryValue: 'Anguilla' },
  { countryName: 'Antarctica', countryValue: 'Antarctica' },
  { countryName: 'Antigua & Barbuda', countryValue: 'Antigua & Barbuda' },
  { countryName: 'Argentina', countryValue: 'Argentina' },
  { countryName: 'Armenia', countryValue: 'Armenia' },
  { countryName: 'Aruba', countryValue: 'Aruba' },
  { countryName: 'Australia', countryValue: 'Australia' },
  { countryName: 'Austria', countryValue: 'Austria' },
  { countryName: 'Azerbaijan', countryValue: 'Azerbaijan' },
  { countryName: 'Bahamas', countryValue: 'Bahamas' },
  { countryName: 'Bahrain', countryValue: 'Bahrain' },
  { countryName: 'Bangladesh', countryValue: 'Bangladesh' },
  { countryName: 'Barbados', countryValue: 'Barbados' },
  { countryName: 'Belarus', countryValue: 'Belarus' },
  { countryName: 'Belgium', countryValue: 'Belgium' },
  { countryName: 'Belize', countryValue: 'Belize' },
  { countryName: 'Benin', countryValue: 'Benin' },
  { countryName: 'Bermuda', countryValue: 'Bermuda' },
  { countryName: 'Bhutan', countryValue: 'Bhutan' },
  { countryName: 'Bolivia', countryValue: 'Bolivia' },
  {
    countryName: 'Bonaire, Sint Eustatius and Saba',
    countryValue: 'Bonaire, Sint Eustatius and Saba'
  },
  { countryName: 'Bosnia & Herzegovina', countryValue: 'Bosnia & Herzegovina' },
  { countryName: 'Botswana', countryValue: 'Botswana' },
  { countryName: 'Brazil', countryValue: 'Brazil' },
  {
    countryName: 'British Indian Ocean Territory',
    countryValue: 'British Indian Ocean Territory'
  },
  {
    countryName: 'British Virgin Islands',
    countryValue: 'British Virgin Islands'
  },
  { countryName: 'Brunei', countryValue: 'Brunei' },
  { countryName: 'Bulgaria', countryValue: 'Bulgaria' },
  { countryName: 'Burkina Faso', countryValue: 'Burkina Faso' },
  { countryName: 'Burundi', countryValue: 'Burundi' },
  { countryName: 'Cambodia', countryValue: 'Cambodia' },
  { countryName: 'Cameroon', countryValue: 'Cameroon' },
  { countryName: 'Canada', countryValue: 'Canada' },
  { countryName: 'Cape Verde', countryValue: 'Cape Verde' },
  { countryName: 'Cayman Islands', countryValue: 'Cayman Islands' },
  {
    countryName: 'Central African Republic',
    countryValue: 'Central African Republic'
  },
  { countryName: 'Chad', countryValue: 'Chad' },
  { countryName: 'Chile', countryValue: 'Chile' },
  { countryName: 'China', countryValue: 'China' },
  { countryName: 'Christmas Island', countryValue: 'Christmas Island' },
  {
    countryName: 'Cocos (Keeling) Islands',
    countryValue: 'Cocos (Keeling) Islands'
  },
  { countryName: 'Colombia', countryValue: 'Colombia' },
  { countryName: 'Comoros', countryValue: 'Comoros' },
  { countryName: 'Congo', countryValue: 'Congo' },
  { countryName: 'Cook Islands', countryValue: 'Cook Islands' },
  { countryName: 'Costa Rica', countryValue: 'Costa Rica' },
  { countryName: "Côte d'Ivoire", countryValue: "Côte d'Ivoire" },
  { countryName: 'Croatia', countryValue: 'Croatia' },
  { countryName: 'Cuba', countryValue: 'Cuba' },
  { countryName: 'Curaçao', countryValue: 'Curaçao' },
  { countryName: 'Cyprus', countryValue: 'Cyprus' },
  { countryName: 'Czechia', countryValue: 'Czechia' },
  {
    countryName: 'Democratic Republic of the Congo',
    countryValue: 'Democratic Republic of the Congo'
  },
  { countryName: 'Denmark', countryValue: 'Denmark' },
  { countryName: 'Djibouti', countryValue: 'Djibouti' },
  { countryName: 'Dominica', countryValue: 'Dominica' },
  { countryName: 'Dominican Republic', countryValue: 'Dominican Republic' },
  { countryName: 'Ecuador', countryValue: 'Ecuador' },
  { countryName: 'Egypt', countryValue: 'Egypt' },
  { countryName: 'El Salvador', countryValue: 'El Salvador' },
  { countryName: 'Equatorial Guinea', countryValue: 'Equatorial Guinea' },
  { countryName: 'Eritrea', countryValue: 'Eritrea' },
  { countryName: 'Estonia', countryValue: 'Estonia' },
  { countryName: 'Eswatini', countryValue: 'Eswatini' },
  { countryName: 'Ethiopia', countryValue: 'Ethiopia' },
  {
    countryName: 'Falkland Islands (Islas Malvinas)',
    countryValue: 'Falkland Islands (Islas Malvinas)'
  },
  { countryName: 'Faroe Islands', countryValue: 'Faroe Islands' },
  { countryName: 'Fiji', countryValue: 'Fiji' },
  { countryName: 'Finland', countryValue: 'Finland' },
  { countryName: 'France', countryValue: 'France' },
  { countryName: 'French Guiana', countryValue: 'French Guiana' },
  { countryName: 'French Polynesia', countryValue: 'French Polynesia' },
  { countryName: 'Gabon', countryValue: 'Gabon' },
  { countryName: 'Gambia', countryValue: 'Gambia' },
  { countryName: 'Georgia', countryValue: 'Georgia' },
  { countryName: 'Germany', countryValue: 'Germany' },
  { countryName: 'Ghana', countryValue: 'Ghana' },
  { countryName: 'Gibraltar', countryValue: 'Gibraltar' },
  { countryName: 'Greece', countryValue: 'Greece' },
  { countryName: 'Greenland', countryValue: 'Greenland' },
  { countryName: 'Grenada', countryValue: 'Grenada' },
  { countryName: 'Guadeloupe', countryValue: 'Guadeloupe' },
  { countryName: 'Guam', countryValue: 'Guam' },
  { countryName: 'Guatemala', countryValue: 'Guatemala' },
  { countryName: 'Guernsey', countryValue: 'Guernsey' },
  { countryName: 'Guinea', countryValue: 'Guinea' },
  { countryName: 'Guinea-Bissau', countryValue: 'Guinea-Bissau' },
  { countryName: 'Guyana', countryValue: 'Guyana' },
  { countryName: 'Haiti', countryValue: 'Haiti' },
  { countryName: 'Honduras', countryValue: 'Honduras' },
  { countryName: 'Hong Kong', countryValue: 'Hong Kong' },
  { countryName: 'Hungary', countryValue: 'Hungary' },
  { countryName: 'Iceland', countryValue: 'Iceland' },
  { countryName: 'India', countryValue: 'India' },
  { countryName: 'Indonesia', countryValue: 'Indonesia' },
  { countryName: 'Iran', countryValue: 'Iran' },
  { countryName: 'Iraq', countryValue: 'Iraq' },
  { countryName: 'Ireland', countryValue: 'Ireland' },
  { countryName: 'Isle of Man', countryValue: 'Isle of Man' },
  { countryName: 'Israel', countryValue: 'Israel' },
  { countryName: 'Italy', countryValue: 'Italy' },
  { countryName: 'Ivory Coast', countryValue: 'Ivory Coast' },
  { countryName: 'Jamaica', countryValue: 'Jamaica' },
  { countryName: 'Japan', countryValue: 'Japan' },
  { countryName: 'Jersey', countryValue: 'Jersey' },
  { countryName: 'Jordan', countryValue: 'Jordan' },
  { countryName: 'Kazakhstan', countryValue: 'Kazakhstan' },
  { countryName: 'Kenya', countryValue: 'Kenya' },
  { countryName: 'Kiribati', countryValue: 'Kiribati' },
  { countryName: 'Kosovo', countryValue: 'Kosovo' },
  { countryName: 'Kuwait', countryValue: 'Kuwait' },
  { countryName: 'Kyrgyzstan', countryValue: 'Kyrgyzstan' },
  { countryName: 'Laos', countryValue: 'Laos' },
  { countryName: 'Latvia', countryValue: 'Latvia' },
  { countryName: 'Lebanon', countryValue: 'Lebanon' },
  { countryName: 'Lesotho', countryValue: 'Lesotho' },
  { countryName: 'Liberia', countryValue: 'Liberia' },
  { countryName: 'Libya', countryValue: 'Libya' },
  { countryName: 'Liechtenstein', countryValue: 'Liechtenstein' },
  { countryName: 'Lithuania', countryValue: 'Lithuania' },
  { countryName: 'Luxembourg', countryValue: 'Luxembourg' },
  { countryName: 'Macau', countryValue: 'Macau' },
  { countryName: 'Macedonia', countryValue: 'Macedonia' },
  { countryName: 'Madagascar', countryValue: 'Madagascar' },
  { countryName: 'Malawi', countryValue: 'Malawi' },
  { countryName: 'Malaysia', countryValue: 'Malaysia' },
  { countryName: 'Maldives', countryValue: 'Maldives' },
  { countryName: 'Mali', countryValue: 'Mali' },
  { countryName: 'Malta', countryValue: 'Malta' },
  { countryName: 'Marshall Islands', countryValue: 'Marshall Islands' },
  { countryName: 'Martinique', countryValue: 'Martinique' },
  { countryName: 'Mauritania', countryValue: 'Mauritania' },
  { countryName: 'Mauritius', countryValue: 'Mauritius' },
  { countryName: 'Mayotte', countryValue: 'Mayotte' },
  { countryName: 'Mexico', countryValue: 'Mexico' },
  { countryName: 'Micronesia', countryValue: 'Micronesia' },
  { countryName: 'Moldova', countryValue: 'Moldova' },
  { countryName: 'Monaco', countryValue: 'Monaco' },
  { countryName: 'Mongolia', countryValue: 'Mongolia' },
  { countryName: 'Montenegro', countryValue: 'Montenegro' },
  { countryName: 'Montserrat', countryValue: 'Montserrat' },
  { countryName: 'Morocco', countryValue: 'Morocco' },
  { countryName: 'Mozambique', countryValue: 'Mozambique' },
  { countryName: 'Myanmar', countryValue: 'Myanmar' },
  { countryName: 'Namibia', countryValue: 'Namibia' },
  { countryName: 'Nauru', countryValue: 'Nauru' },
  { countryName: 'Nepal', countryValue: 'Nepal' },
  { countryName: 'Netherlands', countryValue: 'Netherlands' },
  { countryName: 'Netherlands Antilles', countryValue: 'Netherlands Antilles' },
  { countryName: 'New Caledonia', countryValue: 'New Caledonia' },
  { countryName: 'New Zealand', countryValue: 'New Zealand' },
  { countryName: 'Nicaragua', countryValue: 'Nicaragua' },
  { countryName: 'Niger', countryValue: 'Niger' },
  { countryName: 'Nigeria', countryValue: 'Nigeria' },
  { countryName: 'Niue', countryValue: 'Niue' },
  { countryName: 'Norfolk Island', countryValue: 'Norfolk Island' },
  { countryName: 'North Korea', countryValue: 'North Korea' },
  {
    countryName: 'Northern Mariana Islands',
    countryValue: 'Northern Mariana Islands'
  },
  { countryName: 'Norway', countryValue: 'Norway' },
  { countryName: 'Oman', countryValue: 'Oman' },
  { countryName: 'Pakistan', countryValue: 'Pakistan' },
  { countryName: 'Palau', countryValue: 'Palau' },
  {
    countryName: 'Palestinian Territories',
    countryValue: 'Palestinian Territories'
  },
  { countryName: 'Panama', countryValue: 'Panama' },
  { countryName: 'Papua New Guinea', countryValue: 'Papua New Guinea' },
  { countryName: 'Paraguay', countryValue: 'Paraguay' },
  { countryName: 'Peru', countryValue: 'Peru' },
  { countryName: 'Philippines', countryValue: 'Philippines' },
  { countryName: 'Pitcairn Islands', countryValue: 'Pitcairn Islands' },
  { countryName: 'Poland', countryValue: 'Poland' },
  { countryName: 'Portugal', countryValue: 'Portugal' },
  { countryName: 'Puerto Rico', countryValue: 'Puerto Rico' },
  { countryName: 'Qatar', countryValue: 'Qatar' },
  { countryName: 'Réunion', countryValue: 'Réunion' },
  { countryName: 'Romania', countryValue: 'Romania' },
  { countryName: 'Russia', countryValue: 'Russia' },
  { countryName: 'Rwanda', countryValue: 'Rwanda' },
  { countryName: 'Samoa', countryValue: 'Samoa' },
  { countryName: 'San Marino', countryValue: 'San Marino' },
  { countryName: 'São Tomé & Príncipe', countryValue: 'São Tomé & Príncipe' },
  { countryName: 'Saudi Arabia', countryValue: 'Saudi Arabia' },
  { countryName: 'Senegal', countryValue: 'Senegal' },
  { countryName: 'Serbia', countryValue: 'Serbia' },
  { countryName: 'Seychelles', countryValue: 'Seychelles' },
  { countryName: 'Sierra Leone', countryValue: 'Sierra Leone' },
  { countryName: 'Singapore', countryValue: 'Singapore' },
  { countryName: 'Sint Maarten', countryValue: 'Sint Maarten' },
  { countryName: 'Slovakia', countryValue: 'Slovakia' },
  { countryName: 'Slovenia', countryValue: 'Slovenia' },
  { countryName: 'Solomon Islands', countryValue: 'Solomon Islands' },
  { countryName: 'Somalia', countryValue: 'Somalia' },
  { countryName: 'South Africa', countryValue: 'South Africa' },
  {
    countryName: 'South Georgia & South Sandwich Islands',
    countryValue: 'South Georgia & South Sandwich Islands'
  },
  { countryName: 'South Korea', countryValue: 'South Korea' },
  { countryName: 'South Sudan', countryValue: 'South Sudan' },
  { countryName: 'Spain', countryValue: 'Spain' },
  { countryName: 'Sri Lanka', countryValue: 'Sri Lanka' },
  { countryName: 'St Barthélemy', countryValue: 'St Barthélemy' },
  { countryName: 'St Helena', countryValue: 'St Helena' },
  { countryName: 'St Kitts & Nevis', countryValue: 'St Kitts & Nevis' },
  { countryName: 'St Lucia', countryValue: 'St Lucia' },
  { countryName: 'St Martin', countryValue: 'St Martin' },
  { countryName: 'St Pierre & Miquelon', countryValue: 'St Pierre & Miquelon' },
  {
    countryName: 'St Vincent & Grenadines',
    countryValue: 'St Vincent & Grenadines'
  },
  { countryName: 'Sudan', countryValue: 'Sudan' },
  { countryName: 'Suriname', countryValue: 'Suriname' },
  { countryName: 'Svalbard & Jan Mayen', countryValue: 'Svalbard & Jan Mayen' },
  { countryName: 'Swaziland', countryValue: 'Swaziland' },
  { countryName: 'Sweden', countryValue: 'Sweden' },
  { countryName: 'Switzerland', countryValue: 'Switzerland' },
  { countryName: 'Syria', countryValue: 'Syria' },
  { countryName: 'Taiwan', countryValue: 'Taiwan' },
  { countryName: 'Tajikistan', countryValue: 'Tajikistan' },
  { countryName: 'Tanzania', countryValue: 'Tanzania' },
  { countryName: 'Thailand', countryValue: 'Thailand' },
  { countryName: 'Timor-Leste', countryValue: 'Timor-Leste' },
  { countryName: 'Togo', countryValue: 'Togo' },
  { countryName: 'Tokelau', countryValue: 'Tokelau' },
  { countryName: 'Tonga', countryValue: 'Tonga' },
  { countryName: 'Trinidad & Tobago', countryValue: 'Trinidad & Tobago' },
  { countryName: 'Tunisia', countryValue: 'Tunisia' },
  { countryName: 'Turkey', countryValue: 'Turkey' },
  { countryName: 'Turkmenistan', countryValue: 'Turkmenistan' },
  {
    countryName: 'Turks & Caicos Islands',
    countryValue: 'Turks & Caicos Islands'
  },
  { countryName: 'Tuvalu', countryValue: 'Tuvalu' },
  { countryName: 'Uganda', countryValue: 'Uganda' },
  { countryName: 'Ukraine', countryValue: 'Ukraine' },
  { countryName: 'United Arab Emirates', countryValue: 'United Arab Emirates' },
  { countryName: 'United Kingdom', countryValue: 'United Kingdom' },
  { countryName: 'United States', countryValue: 'United States' },
  { countryName: 'Uruguay', countryValue: 'Uruguay' },
  { countryName: 'US Virgin Islands', countryValue: 'US Virgin Islands' },
  { countryName: 'Uzbekistan', countryValue: 'Uzbekistan' },
  { countryName: 'Vanuatu', countryValue: 'Vanuatu' },
  { countryName: 'Vatican City', countryValue: 'Vatican City' },
  { countryName: 'Venezuela', countryValue: 'Venezuela' },
  { countryName: 'Vietnam', countryValue: 'Vietnam' },
  { countryName: 'Wallis & Futuna', countryValue: 'Wallis & Futuna' },
  { countryName: 'Western Sahara', countryValue: 'Western Sahara' },
  { countryName: 'Yemen', countryValue: 'Yemen' },
  { countryName: 'Zambia', countryValue: 'Zambia' },
  { countryName: 'Zimbabwe', countryValue: 'Zimbabwe' }
];

export default countryFullList;
