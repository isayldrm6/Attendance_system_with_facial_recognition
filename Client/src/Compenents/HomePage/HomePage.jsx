import React, { useState, useEffect } from "react";
import "./HomePage.css";
import axios from "axios";

const HomePage = () => {
  const [activeDers, setActiveDers] = useState(null);
  const [activeHafta, setActiveHafta] = useState(null);
  const [veriler, setVeriler] = useState([]);

  const toggleSubMenu = (ders) => {
    setActiveDers(activeDers === ders ? null : ders);
  };
  const toggleHafta = (hafta) => {
    setActiveHafta(activeHafta === hafta ? null : hafta);
  };
  useEffect(() => {
    // Verileri çek
    axios
      .get("http://localhost:5000/veriler")
      .then((response) => setVeriler(response.data))
      .catch((error) => console.error("Veri çekme hatası:", error));
  }, []);
  const getWeekDates = (week) => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - today.getDay() + (week - 1) * 7);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    return { startDate, endDate };
  };

  return (
    <>
      <div className="sidenav">
        <header>
          <h2>DERSLER</h2>
        </header>
        <ul>
          {[1, 2, 3].map((ders) => (
            <li
              key={ders}
              className={`asd ${activeDers === ders ? "active" : ""}`}
            >
              <a onClick={() => toggleSubMenu(ders)}>Algoritma{ders}</a>
              {activeDers === ders && (
                <ul className="sub-menu">
                  <li>Tüm Haftalar</li>
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="main">
        <div className={`container ${activeHafta !== null ? "open" : ""}`}>
          <h1 className="baslik">Yoklama Listesi</h1>
          <table className="veri-listesi">
            <thead>
              <tr>
                <th>Ad</th>
                {[...Array(14).keys()].map((week) => (
                  <th>Hafta {week + 1}</th>
                ))}
                <th>Toplam</th>
              </tr>
            </thead>
            <tbody>
              {veriler.map((veri, index) => (
                <tr key={index} className="veri-elemani">
                  <td>{veri.Ad}</td>
                  {[...Array(14).keys()].map((week) => (
                    <td key={week + 1}>
                      {veri.Tarih &&
                      new Date(veri.Tarih).getTime() >=
                        getWeekDates(week + 1).startDate.getTime() &&
                      new Date(veri.Tarih).getTime() <=
                        getWeekDates(week + 1).endDate.getTime()
                        ? "var"
                        : ""}
                    </td>
                  ))}
                  <td>
                    {veriler
                      .filter((v) => v.Ad === veri.Ad)
                      .reduce((total, v) => {
                        return (
                          total +
                          [...Array(14).keys()].reduce((weeklyTotal, week) => {
                            const weekDates = getWeekDates(week + 1);
                            return (
                              weeklyTotal +
                              (v.Tarih &&
                              new Date(v.Tarih).getTime() >=
                                weekDates.startDate.getTime() &&
                              new Date(v.Tarih).getTime() <=
                                weekDates.endDate.getTime()
                                ? 1
                                : 0)
                            );
                          }, 0)
                        );
                      }, 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default HomePage;
