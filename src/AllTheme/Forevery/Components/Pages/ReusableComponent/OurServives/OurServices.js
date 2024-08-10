import React from 'react';
import './OurServices.scss';


const Services = ({services}) => {
  return (
    <div className='for_serviceMainDiv'>
        <h2>Our Services</h2>
      <div className="for_services-container">
        <div className="for_services-list">
          {services?.map((service, index) => (
            <div className="for_service-item" key={index}>
              <img src={service?.image} alt={service?.title} />
              <h3>{service?.title}</h3>
              <p>{service?.description}</p>
              <a href={service?.link}>{service?.btnText}</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
