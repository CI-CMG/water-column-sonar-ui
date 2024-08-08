/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable no-use-before-define */

import React, {
  useState,
  useEffect,
} from 'react';
import { Link } from 'react-router-dom';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import _ from 'lodash';
import {
  Container, Card, Row, Col,
} from 'react-bootstrap';
import { config } from '../../config';

export default function HomeView() {
  useEffect(() => { document.title = `${config.APP_TITLE} Home`; }, []);

  // gets products within satellites within missions
  const satelliteConfigurations = config.satellites

  const missionSatelliteInstrument = _.chain(satelliteConfigurations)
    .keys().sort()
    .map((satellite) => _.chain(satelliteConfigurations[satellite]).get('instruments').map('mission').uniq()
      .flatMap((mission) => {
        const instrument = _.chain(satelliteConfigurations[satellite]).get('instruments').value();
        return _.chain(instrument)
          .map('mission')
          .flatMap(() => {
            const inst = _.chain(_.keys(instrument)).filter((x) => instrument[x].mission === mission).without(undefined).value()
            const sa = { [satellite]: inst }
            return { [mission]: sa };
          })
          .value();
      })
      .value())
    .flatten()
    .value()

  const missionSatelliteInstruments = _.merge(...missionSatelliteInstrument)

  // Hack to sort the tabs by 'GOES-R' -> 'DSCOVR' -> 'SWFO'
  const missions = _.chain(missionSatelliteInstruments).keys().sortBy((a) => !a.includes('-')).value()
  // const [key, setKey] = useState(missions[0]);

  const [mission, setMission] = useState(missions[0]);

  const moveUnderline = (newTab) => {
    const tabsContainer = document.querySelector('[role=tablist]');
    const newTabWidth = newTab.offsetWidth / tabsContainer.offsetWidth;
    tabsContainer.style.setProperty(
      '--translate-border',
      `${newTab.offsetLeft}px`,
    );
    tabsContainer.style.setProperty('--animate-border', `${newTabWidth}`);
  };

  useEffect(() => {
    // Move underline to the right
    const currentTab = document.querySelector('[aria-selected="true"]');

    if (currentTab) {
      moveUnderline(currentTab);
    }
  }, [mission]);

  return (
    <div className="HomeView">
      <Container>
        <h2>NCEI Space Weather Portal</h2>

        <Tabs
          id="controlled-tab-example"
          activeKey={mission}
          onSelect={(k) => setMission(k)}
          className="mb-3"
          justify
        >
          {missions.map((type, index) => (
            <Tab
              eventKey={type}
              title={type}
              className="display-4"
              key={type}
            />
          ))}
        </Tabs>

        <Row className="g-4">
          <>
            {
              _.keys(missionSatelliteInstruments[mission]).map((ssat) => {
                const mi = mission
                const sa = ssat
                const instrumentList = missionSatelliteInstruments[mission][sa]
                const satConfig = config.satellites[sa];
                // console.log(`  instruments: ${instrumentList}`)

                return (
                  <Col sm={12} md={6} lg={6} key={sa} className="cardColumn">
                    <Card>
                      <figure
                        to={`overview?sat=${satConfig.name}`}
                        key="{sat.name} + image"
                        className="card-image"
                      >
                        <Card.Img
                          src={require(`../../assets/images/${satConfig.name.toLowerCase()}-logo.png`)}
                          alt={`${satConfig.name} Card Image`}
                          name={satConfig.name}
                          key={satConfig.name}
                          loading="lazy"
                          className="mx-auto d-block"
                        />
                      </figure>

                      <Card.Body>
                        <Card.Link
                          href={`/overview?sat=${satConfig.name}`}
                          key={satConfig.name}
                        >
                          <h3>{satConfig.title}</h3>
                        </Card.Link>

                        {renderFutureMissionMsg(satConfig.data_start_date)}

                        <Card.Text className="text-left">
                          {satConfig.description.split('. ')[0]}
                          .&nbsp;
                        </Card.Text>

                        <br />

                        {renderOpsStartDate(satConfig.name)}

                        {renderOpsEndDate(satConfig.ops_end_date)}
                      </Card.Body>

                      <Card.Footer key={satConfig.name}>
                        <div className="instruments">
                          {
                              instrumentList.map((instr) => (
                                <Link
                                  to={`/summary?sat=${satConfig.name}&inst=${instr}`}
                                  key={`${sa.name}${instr}`}
                                >
                                  <button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    key={`${satConfig.name}${instr}`}
                                  >
                                    {`${satConfig.name} — ${instr}`}
                                  </button>
                                </Link>
                              ))
                            }
                        </div>
                      </Card.Footer>

                    </Card>
                  </Col>
                )
              })
            }
          </>
        </Row>

        <br />
        <br />
        <br />
        <br />

        <div className="AppVersion">
          <p className="text-right small">
            Application Version:
            {' '}
            {config.APP_VERSION}
          </p>
        </div>

      </Container>
    </div>
  );

  function renderFutureMissionMsg(date) {
    return (
      <>
        <br />

        <Card.Text key={date}>
          <strong>
            { !date ? 'Future Mission' : <>&nbsp;</> }
          </strong>
        </Card.Text>
      </>
    )
  }

  function renderOpsStartDate(sat) {
    if (!sat.launch_date) {
      return null
    }
    return (
      <Card.Text key={sat.name} className="text-dark">
        <i>
          Launch Date:&nbsp;
          {(!sat.launch_date) ? 'T.B.D.' : sat.launch_date}
        </i>
      </Card.Text>
    )
  }

  function renderOpsEndDate(date) {
    if (!date) {
      return null
    }
    return (
      <Card.Text key={date} className="text-dark">
        <i>
          Operations End Date:&nbsp;
          {date}
        </i>
      </Card.Text>
    )
  }
}
