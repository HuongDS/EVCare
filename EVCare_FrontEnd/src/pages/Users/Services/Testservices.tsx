// import React from "react";
import { ServiceRequest } from "./ServiceApi";

export default function ServiceList() {
  const { data, isLoading, error, isSuccess } = ServiceRequest();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {(error as Error).message}</p>;

  return (
    <div>
      <h2>Services</h2>
      <ul>
        {isSuccess && (
          <ul>
            {data.data.map((service: any) => (
              <li key={service.id}>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <p>⏱ Duration: {service.duration} hours</p>
                {/* <p>🗑 Deleted: {service.isDeleted ? "Yes" : "No"}</p> */}
              </li>
            ))}
          </ul>
        )}
      </ul>
    </div>
  );
}
