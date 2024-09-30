import React, { useState } from 'react';
import About from './About';
import Animation from './Animation';
import MainLayout from './MainLayout';
import config from './jsons/config.json';

const SobelOperatorApp = () => {
  const renderAcercaDe = () => <About />;
  const renderAnimacion = () => <Animation />;
  const [activeSection, setActiveSection] = useState('inicio');
  const renderContent = () => {
    switch(activeSection) {
      case 'animación': return renderAnimacion();
      case 'acerca de': return renderAcercaDe();
      default: return renderAnimacion();
    }
  };

  return (
    <MainLayout
      appName={config.appName}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      renderContent={renderContent}
    />
  );
};

export default SobelOperatorApp;
