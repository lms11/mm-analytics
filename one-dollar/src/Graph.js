import React from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

export default function Graph({lastData, marketChanges, title}) {
  if (lastData == null || marketChanges == null) {
    return null;
  }

  const openFlags = {
    type: 'flags',
    data: marketChanges
      .filter((x) => x.a === 'OPEN')
      .map((x) => {
        return {x: x.t, title: 'O', text: 'Open'};
      }),
    onSeries: 'dataseries',
    shape: 'circlepin',
    width: 16,
  };

  const suspendedFlags = {
    type: 'flags',
    data: marketChanges
      .filter((x) => x.a === 'SUSPENDED')
      .map((x) => {
        return {x: x.t, title: 'S', text: 'Suspended'};
      }),
    onSeries: 'dataseries',
    shape: 'squarepin',
    width: 16,
  };

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={'stockChart'}
        options={{
          title: {
            text: title,
          },
          series: [
            {
              data: lastData.map((x) => [x.t, x.p]),
              id: 'dataseries',
            },
            openFlags,
            suspendedFlags,
          ],
        }}
      />
    </div>
  );
}
