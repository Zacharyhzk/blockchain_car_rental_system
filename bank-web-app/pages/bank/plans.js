import React, { useState } from 'react';
import { Row, Col } from 'antd';
import PlansTable from '../../components/plan/PlansTable';
import CreatePlanForm from '../../components/plan/CreatePlanForm';

function BankLoanPlans() {
	const [togglePlan, setTogglePlan] = useState(true);
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

export default BankLoanPlans;
