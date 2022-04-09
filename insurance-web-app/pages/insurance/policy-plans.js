import React, { useState } from 'react';
import { Row, Col } from 'antd';
import CreatePlanForm from '../../components/plans/CreatePlanForm';
import PlansTable from '../../components/plans/PlansTable';

function PolicyPlan() {
	const [togglePlan, setTogglePlan] = useState(false);
	return (
		<Row gutter={[16, 16]}>
			<Col span={24}>
				<CreatePlanForm setTogglePlan={setTogglePlan} togglePlan={togglePlan} />
			</Col>
			<Col span={24}>
				<PlansTable togglePlan={togglePlan} />
			</Col>
		</Row>
	);
}

export default PolicyPlan;
