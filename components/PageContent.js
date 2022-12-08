import { useState } from "react";

const PageContent = ({ title, contentList }) => {
    const [sectionDisplayed, setSectionDisplayed] = useState(contentList[0].section);

    return (
        <div className="page-content">
            <div className="page-content-header">
                <h2>{title}</h2>
                <div className="page-content-select">
                    {contentList.length == 1
                        ? null
                        : contentList.map((content) => {
                              return (
                                  <p
                                      className={
                                          "page-content-select-text" +
                                          (sectionDisplayed === content.section
                                              ? " page-content-select-text-selected"
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
            <div className="page-content-body">
                {
                    contentList.filter((content) => {
                        return content.section === sectionDisplayed;
                    })[0].component
                }
            </div>
        </div>
    );
};

export default PageContent;
