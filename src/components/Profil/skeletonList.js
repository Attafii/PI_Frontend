import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData([
        { id: 1, title: "Design Better UI", price: "$99.49" },
        { id: 2, title: "Learn React", price: "$49.99" },
      ]);
      setIsLoading(false);
    }, 3000); // 3 seconds
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      {isLoading ? (
        Array(5)
          .fill()
          .map((_, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <Skeleton
                width={50}
                height={50}
                style={{ marginRight: "10px", borderRadius: "8px" }}
              />
              <div style={{ flex: 1 }}>
                <Skeleton width="80%" />
                <Skeleton width="60%" />
              </div>
            </div>
          ))
      ) : (
        <ul>
          {data.map((item) => (
            <li key={item.id}>
              {item.title} - {item.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SkeletonList;
