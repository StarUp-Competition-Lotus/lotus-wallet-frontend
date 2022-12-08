import { useState } from "react";

const PageContainer = ({ title, contentList }) => {
    const [sectionDisplayed, setSectionDisplayed] = useState(contentList[0].section);

    return (
        <div className="page-container">
            <div className="page-container-header">
                <h2>{title}</h2>
                <div className="page-container-select">
                    {contentList.length == 1
                        ? null
                        : contentList.map((content) => {
                              return (
                                  <p
                                      className={
                                          "page-container-select-text" +
                                          (sectionDisplayed === content.section
                                              ? " page-container-select-text-selected"
                                              : "")
                                      }
                                      onClick={() => {
                                          setSectionDisplayed(content.section);
                                      }}
                                  >
                                      {content.section}
                                  </p>
                              );
                          })}
                </div>
            </div>
            <div className="page-container-body">
                {
                    contentList.filter((content) => {
                        return content.section === sectionDisplayed;
                    })[0].component
                }
            </div>
        </div>
    );
};

export default PageContainer;
