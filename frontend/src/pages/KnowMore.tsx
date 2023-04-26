import React, { useContext, useEffect, useState } from "react";
import styles from "@/styles/KnowMore.module.css";
import { Header } from "@/components/HeaderComponent";
import { Footer } from "@/components/FooterComponent";
import { KnowMore as KnowMoreType } from "@/types/KnowMore";
import axios from "axios";
import { Config } from "@/types/Config";
import { User } from "@/models/User";
import { UserContext } from "@/contexts/UserContext";

function KnowMore() {
  const [data, setData] = useState<KnowMoreType | null>(null);
  const userContext = useContext(UserContext);
  useEffect(() => {
    const loader = async () => {
      const user: User = new User();
      const validToken: boolean = await user.verifyToken();
      if (!validToken) {
        userContext.logout();
        user.getAndSaveGuestToken();
        localStorage.removeItem("user_info");
        return;
      }
      const page_name: string | null = localStorage.getItem("page_name");
      const config: Config = {
        headers: {
          Authorization: `Bearer ${user.getCookieJson().jwt}`,
        },
      };
      if (page_name !== null) {
        const response = await axios.post(
          axios.defaults.baseURL + "/krsp/info_page/get_info_page_data/",
          { page_name: page_name },
          config
        );
        setData(JSON.parse(response.data));
      }
    };
    loader();
  }, []);
  console.log(data);
  return (
    <div className={styles.body}>
      <Header />
      <div className={styles.App}>
        <h1>{data?.header}</h1>
        <main>
          <section>
            <h2 className={styles.h2}>{data?.whatQuestion}</h2>
            <p>{data?.whatAnswer}</p>
          </section>
          <section>
            <h2 className={styles.h2}>{data?.symptomsTitle}</h2>
            <ul className={styles.ul}>
              {data?.symptoms.map((item) => {
                return <li>{item}</li>;
              })}
            </ul>
          </section>
          <section>
            <h2 className={styles.h2}>{data?.causeQuestion}</h2>
            <p>{data?.causeAnswer}</p>
            <ul className={styles.ul}>
              {data?.causes.map((item) => {
                return <li>{item}</li>;
              })}
            </ul>
          </section>
          <section>
            <h2 className={styles.h2}>{data?.treatmentTitle}</h2>
            <p>{data?.treatmentTitle}</p>
          </section>
          <section>
            <h2 className={styles.h2}>{data?.copingHeader}</h2>
            <p>{data?.copingParagraph}</p>
            <ul className={styles.ul}>
              {data?.coping.map((item) => {
                return <li>{item}</li>;
              })}
            </ul>
          </section>
          <section>
            <h2 className={styles.h2}>{data?.resourcesHeader}</h2>
            <p>{data?.resourcesParagraph}</p>
            <ul className={styles.ul}>
              {data?.resourcesList.map((item) => {
                return (
                  <li>
                    {item.text}
                    {item.href && <a href={item.href}>{item.url_text}</a>}
                  </li>
                );
              })}
            </ul>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default KnowMore;
