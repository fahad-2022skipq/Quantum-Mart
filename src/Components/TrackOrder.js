import React from 'react';
import {
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  Box
} from '@chakra-ui/react';

function TrackOrder({status}) {
  const steps = [
    { title: 'Order Processing', description: 'Processing the order' },
    { title: 'Shipped', description: 'Order has been shipped' },
    { title: 'Delivered', description: 'Order has been delivered' },
];

  function Status() {
    const { activeStep } = useSteps({
      index: status==='pending'?1:status==="shipped"?2:3,
      count: steps.length,
    });
  
    return (
        <Stepper index={activeStep} orientation='vertical' height='200px' gap='0'>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>
  
            <Box flexShrink='0'>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>
  
            <StepSeparator />
          </Step>
        ))}
      </Stepper>
    );
  }

  return <Status />;
}

export default TrackOrder;