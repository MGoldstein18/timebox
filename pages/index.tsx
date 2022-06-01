import {
  Text,
  Heading,
  VStack,
  Box,
  Select,
  Stack,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
  CloseButton,
  FormHelperText,
  Flex,
  FormControl
} from '@chakra-ui/react';
import type { NextPage } from 'next';
import { useState } from 'react';
import Chart from 'react-google-charts';

const Home: NextPage = () => {
  const [data, setData] = useState<any[]>([['Task', 'Urgency', 'Impact']]);

  const [tasks, setTasks] = useState<any[]>([]);

  const [grid, setGrid] = useState([
    [false, false, false],
    [false, false, false],
    [false, false, false]
  ]);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('Urgency');
  const [impact, setImpact] = useState('Impact');

  const levels = ['Low', 'Medium', 'High'];

  const handleNameChange = (e: any) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e: any) => {
    setDescription(e.target.value);
  };

  const handleUrgencyChange = (e: any) => {
    setUrgency(e.target.value);
  };

  const handleImpactChange = (e: any) => {
    setImpact(e.target.value);
  };

  const checkForRepeat = ({ x, y }: { x: number; y: number }) => {
    const stateGrid = grid;
    if (stateGrid[x - 1][y - 1] === true) {
      return false;
    }

    stateGrid[x - 1][y - 1] = true;
    setGrid(stateGrid);

    return true;
  };

  function addTask() {
    const intImpact = levels.indexOf(impact) + 1;
    const intUrgency = levels.indexOf(urgency) + 1;
    if (name === '' || intUrgency === -1 || intImpact === -1) {
      alert('Error! Please make sure to include a name, urgency and impact.');
      return;
    }
    if (
      checkForRepeat({ x: Number(intUrgency), y: Number(intImpact) }) === false
    ) {
      alert(
        "Error! You can't add tasks with the same urgency and impact as another task"
      );
      return;
    }
    const newTask = {
      name,
      description,
      urgency,
      impact
    };

    setTasks((tasks) => [...tasks, newTask]);

    setData((data) => [...data, [name, intUrgency, intImpact]]);

    setName('');
    setDescription('');
    setUrgency('Urgency');
    setImpact('Impact');
  }

  const deleteTask = async (taskId: number) => {
    const impact = tasks[taskId].impact;
    const urgency = tasks[taskId].urgency;

    const intImpact = levels.indexOf(impact);
    const intUrgency = levels.indexOf(urgency);

    const stateGrid = grid;

    stateGrid[intUrgency][intImpact] = false;

    setGrid([...stateGrid]);

    const stateTasks = tasks;
    stateTasks.splice(taskId, 1);
    setTasks([...stateTasks]);

    const stateData = data;
    stateData.splice(taskId + 1, 1);
    setData([...stateData]);
  };

  const taskElements = tasks.map((task) => {
    const key = tasks.indexOf(task);
    return (
      <Tr key={key}>
        <Td>{task.name}</Td>
        <Td>{task.description}</Td>
        <Td>{task.urgency}</Td>
        <Td>{task.impact}</Td>
        <Td>
          <CloseButton onClick={() => deleteTask(key)} />
        </Td>
      </Tr>
    );
    return true;
  });

  return (
    <Flex direction='column'>
      <VStack textAlign={'center'} mt='2rem'>
        <Heading fontFamily={'monospace'} color='steelblue' fontSize='62px'>
          TimeBox
        </Heading>
        <Text fontFamily={'monospace'} color='steelblue' fontSize='20px'>
          Organize your tasks by impact and urgency
        </Text>
      </VStack>

      <Stack m='2rem' align={'center'}>
        <TableContainer overflow={'auto'} p='1rem' width={'80vw'} shadow='md' borderWidth='3px'>
          <Table size='sm' variant='striped'>
            <TableCaption>All Tasks</TableCaption>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Description</Th>
                <Th>Urgency</Th>
                <Th>Impact</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {taskElements}
              <Tr>
                <Th>
                  <FormControl>
                    <Input
                      placeholder='Task name'
                      value={name}
                      onChange={handleNameChange}
                    />
                    <FormHelperText
                      fontFamily={'sans-serif'}
                      fontWeight={'normal'}
                      fontSize={'10px'}
                    >
                      Keyword(s) about the task
                    </FormHelperText>
                  </FormControl>
                </Th>
                <Th>
                  <FormControl>
                    <Input
                      placeholder='Task description'
                      value={description}
                      onChange={handleDescriptionChange}
                    />
                    <FormHelperText
                      fontFamily={'sans-serif'}
                      fontWeight={'normal'}
                      fontSize={'10px'}
                    >
                      Details about the task
                    </FormHelperText>
                  </FormControl>
                </Th>
                <Th>
                  <FormControl>
                    <Select value={urgency} onChange={handleUrgencyChange}>
                      <option value='Urgency'>Urgency</option>
                      <option value='Low'>Low</option>
                      <option value='Medium'>Medium</option>
                      <option value='High'>High</option>
                    </Select>
                    <FormHelperText
                      fontFamily={'sans-serif'}
                      fontWeight={'normal'}
                      fontSize={'10px'}
                    >
                      How urgent is the task?
                    </FormHelperText>
                  </FormControl>
                </Th>
                <Th>
                  <FormControl>
                    <Select value={impact} onChange={handleImpactChange}>
                      <option value='Impact'>Impact</option>
                      <option value='Low'>Low</option>
                      <option value='Medium'>Medium</option>
                      <option value='High'>High</option>
                    </Select>
                    <FormHelperText
                      fontFamily={'sans-serif'}
                      fontWeight={'normal'}
                      fontSize={'10px'}
                    >
                      How much impact does the task have?
                    </FormHelperText>
                  </FormControl>
                </Th>{' '}
                <Th>
                  <Button onClick={addTask}>Add</Button>
                </Th>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
        {data.length > 1 ? (
          <Chart
            loader={<div>Loading Chart...</div>}
            chartType='BubbleChart'
            width={'80vw'}
            height={'80vh'}
            data={data}
            options={{
              hAxis: { title: 'Urgency', ticks: [0, 1, 2, 3, 4] },
              vAxis: { title: 'Impact', ticks: [0, 1, 2, 3, 4] },
              colors: ['orange'],
              bubble: {
                textStyle: {
                  color: 'black',
                  fontSize: 13,
                  fontName: 'Time-Roman',
                  auraColor: 'none',
                  bold: true,
                  opacity: 1.0
                }
              }
            }}
          />
        ) : (
          <Box
            shadow='md'
            borderWidth='1px'
            width={'80vw'}
            height={'80vh'}
            textAlign='center'
          >
            <Text fontSize={'28px'} fontWeight={'semibold'}>
              Start by adding a task!
            </Text>
          </Box>
        )}
      </Stack>
    </Flex>
  );
};

export default Home;
