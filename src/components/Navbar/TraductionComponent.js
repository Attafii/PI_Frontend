import React, { useState } from 'react';
import { Menu, Button, Avatar } from 'antd';
import { GlobalOutlined } from '@ant-design/icons'; // Importer l'icône
import { useTranslation } from 'react-i18next';

const TraductionComponent = () => {
  const [t, i18n] = useTranslation("global");
  const [size, setSize] = useState('large');

  const handleChangeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  const items = [
    {
      label: (
        <Button
          type="secondary"
          shape="circle"
          size={size}
          onClick={() => handleChangeLanguage('en')}
        >
          <Avatar alt="Remy Sharp" src="https://th.bing.com/th/id/OIP.GHnIXUby5aNeVlYAGwavAQHaHa?rs=1&pid=ImgDetMain" />English
        </Button>
      ),
      key: 'alipayEn',
    },
    {
      label: (
        <Button
          type="secondary"
          shape="circle"
          size={size}
          onClick={() => handleChangeLanguage('fr')}
        >
          <Avatar alt="Remy Sharp" src="https://image.pngaaa.com/324/1388324-middle.png" /> Français
        </Button>
      ),
      key: 'alipayFr',
    },
    {
      label: (
        <Button
          type="secondary"
          shape="circle"
          size={size}
          onClick={() => handleChangeLanguage('ar')}
        >
          <Avatar alt="Remy Sharp" src="https://th.bing.com/th/id/R.e7ca0af9e0759fd9746e6f934c650a6b?rik=Jpgx%2b65Qz19C%2bg&riu=http%3a%2f%2ftunisievisa.info%2fwp-content%2fuploads%2f2015%2f06%2ftunisie.png&ehk=RJCtSl8qGA%2fpmoU%2f%2fb2b0TvsvMbPkSRx5r086ThMWew%3d&risl=&pid=ImgRaw&r=0" />
          العربية</Button>
      ),
      key: 'alipayAr',
    },
  ];

  return (
    <Menu mode="horizontal" items={[{ 
      key: 'language', 
      icon: <GlobalOutlined />, 
      title: 'Language', 
      children: items 
    }]} />
  );
};

export default TraductionComponent;
