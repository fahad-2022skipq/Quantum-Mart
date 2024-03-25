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
  Box,
  useMediaQuery
} from '@chakra-ui/react';

function TrackOrder({status}) {
  const [isMobile] = useMediaQuery("(max-width: 768px)");
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
        <Stepper index={activeStep} orientation={isMobile?'horizontal':'vertical'} size={{base:'xs',md:'md'}} height={{base:'50px', md:'200px'}} width={{base:'100%'}} gap='0'>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>
  
            <Box flexShrink='0' text>
              <StepTitle>{step.title}</StepTitle>
              {!isMobile&&<StepDescription>{step.description}</StepDescription>}
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