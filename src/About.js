import React from 'react';
import aboutData from './jsons/about.json';
const About = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4">{aboutData.title}</h3>
        <div className="flex flex-col md:flex-row">
            <div className="md:w-3/10 mb-4 md:mb-0 md:mr-4">
            <img
                src={aboutData.imageSrc}
                alt={aboutData.imageAlt}
                className="w-full rounded-lg shadow-md"
            />
            <br></br>
            <center>{aboutData.name}</center>
            </div>
            <div className="md:w-7/10">
            <h4 className="text-lg font-semibold mb-2">{aboutData.sectionTitle}</h4>
            <p className="mb-2">{aboutData.description}</p>

            </div>
        </div>
        </div>
    );
};

export default About;