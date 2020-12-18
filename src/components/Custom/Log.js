import React from "react";

export function Log(props) {
  return (
    <div className="table-responsive">
      {!props.data.isLoading && props.data.logs && props.headerInfo ? (
        <table className="table table-hover table-bordered">
          <thead className="table-light">
            <tr>
              {props.headerInfo.headers.map((header) => {
                return <th key={props.name + header}>{header}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {props.data.logs.map((item, i) => {
              return (
                <tr
                  style={{ cursor: "pointer" }}
                  className="table-light"
                  key={props.name + i}
                  onClick={props.onClick ? () => props.onClick(item) : null}
                >
                  {props.headerInfo.headers.map((rawHeader, j) => {
                    const header = rawHeader.toLowerCase();
                    const subHeader = props.headerInfo.subHeaders[header];
                    return (
                      <td key={props.name + i + j}>
                        {subHeader && item[header]
                          ? item[header].reverse().map((sItem, k) => {
                              return (
                                <p key={props.name + i + j + k}>
                                  {sItem[subHeader]}
                                </p>
                              );
                            })
                          : item[header]}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
}
