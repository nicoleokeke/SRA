import { useEffect, useState } from 'react';
import {
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  rem,
  keys,
  Loader,
} from '@mantine/core';
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
} from '@tabler/icons-react';
import classes from './index.module.css';
import AddCourseModal from '../../components/addCourseModal';
import { useQuery } from '@tanstack/react-query';
import { BACKEND_URL } from '../../constant';

interface RowData {
  _id: string;
  courseName: string;
  studentsAssigned: number;
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;

  return (
    <Table.Th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function filterData(data: RowData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter(item =>
    keys(data[0]).some(key =>
      item[key].toString().toLowerCase().includes(query),
    ),
  );
}

function sortData(
  data: RowData[],
  payload: { sortBy: keyof RowData | null; reversed: boolean; search: string },
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return payload.reversed
          ? bVal.localeCompare(aVal)
          : aVal.localeCompare(bVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return payload.reversed ? bVal - aVal : aVal - bVal;
      }

      return 0;
    }),
    payload.search,
  );
}

export function Page() {
  const { data, isLoading } = useQuery({
    queryKey: ['courses/get'],
    initialData: [],
    queryFn: () =>
      fetch(`${BACKEND_URL}/courses`)
        .then(res => res.json())
        .then(({ data }) => data as RowData[]),
  });
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  useEffect(() => {
    if (data) {
      setSortedData(data);
    }
  }, [data]);

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search: value }),
    );
  };

  const rows = sortedData.map(row => (
    <Table.Tr key={row._id}>
      <Table.Td>{row.courseName}</Table.Td>
      <Table.Td>{row.studentsAssigned}</Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Group mb="md">
        <TextInput
          placeholder="Search by any field"
          leftSection={
            <IconSearch
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          }
          value={search}
          onChange={handleSearchChange}
          flex="1"
        />

        <AddCourseModal />
      </Group>

      <ScrollArea>
        <Table
          horizontalSpacing="md"
          verticalSpacing="xs"
          miw={700}
          layout="fixed"
          striped
          withRowBorders={false}
        >
          <Table.Thead>
            <Table.Tr>
              <Th
                sorted={sortBy === 'courseName'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('courseName')}
              >
                Course Name
              </Th>
              <Th
                sorted={sortBy === 'studentsAssigned'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('studentsAssigned')}
              >
                Students Assigned
              </Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {isLoading ? (
              <Table.Tr>
                <Table.Td colSpan={3} align="center">
                  <Loader />
                </Table.Td>
              </Table.Tr>
            ) : rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={2}>
                  <Text fw={500} ta="center">
                    Nothing found
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </>
  );
}

export default Page;
