import { Button, Group, Modal, Select, rem } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCirclePlus } from '@tabler/icons-react';
import { useState } from 'react';
import { z } from 'zod';
import { BACKEND_URL } from '../../constant';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const schema = z.object({
  courseName: z.string(),
  studentName: z.string(),
  score: z.string(),
});

const iconStyles = { style: { width: rem(20), height: rem(20) }, stroke: 1.5 };
const AddResultModal = () => {
  const courseQuery = useQuery({
    queryKey: ['courses/get'],
    initialData: [],
    queryFn: () =>
      fetch(`${BACKEND_URL}/courses`)
        .then(res => res.json())
        .then(({ data }) =>
          data.map((c: { _id: string; courseName: string }) => ({
            value: c._id,
            label: c.courseName,
          })),
        ),
  });
  const studentQuery = useQuery({
    queryKey: ['students/get'],
    initialData: [],
    queryFn: () =>
      fetch(`${BACKEND_URL}/students`)
        .then(res => res.json())
        .then(({ data }) =>
          data.map(
            (s: { _id: string; firstName: string; familyName: string }) => ({
              value: s._id,
              label: `${s.firstName} ${s.familyName}`,
            }),
          ),
        ),
  });
  const [scores] = useState([
    { value: 'A', label: 'A' },
    { value: 'B', label: 'B' },
    { value: 'C', label: 'C' },
    { value: 'D', label: 'D' },
    { value: 'E', label: 'E' },
    { value: 'F', label: 'F' },
  ]);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values: typeof form.values) =>
      fetch(`${BACKEND_URL}/results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      }),
    onSuccess: async (res, values) => {
      await queryClient.invalidateQueries({ queryKey: ['results/get'] });
      if (!res.ok) {
        return notifications.show({
          title: 'Error',
          message: 'Failed to add result, please try again',
          color: 'red',
        });
      }

      notifications.show({
        title: 'Result added',
        message: `${values.studentName}'s result added to the list`,
      });
      close();
      form.reset();
    },
    onError: () => {
      notifications.show({
        title: 'Error',
        message: 'Failed to add result, please try again',
        color: 'red',
      });
    },
  });
  const [opened, { open, close }] = useDisclosure(false);
  const form = useForm({
    initialValues: {
      courseName: '',
      studentName: '',
      score: '',
    },
    validate: zodResolver(schema),
  });

  const handleSubmit = (values: typeof form.values) => {
    mutation.mutate(values);
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => {
          close();
          form.reset();
        }}
        title="Add new result"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Select
            label="Course Name"
            withAsterisk
            data={courseQuery.data}
            {...form.getInputProps('courseName')}
          />
          <Select
            label="Student Name"
            withAsterisk
            data={studentQuery.data}
            {...form.getInputProps('studentName')}
          />
          <Select
            label="Score"
            withAsterisk
            data={scores}
            {...form.getInputProps('score')}
          />

          <Group justify="flex-end" mt="md">
            <Button type="submit" loading={mutation.status === 'pending'}>
              Submit
            </Button>
          </Group>
        </form>
      </Modal>

      <Button
        onClick={open}
        leftSection={<IconCirclePlus {...iconStyles} />}
        visibleFrom="md"
      >
        Add New Result
      </Button>

      <Button onClick={open} hiddenFrom="md">
        <IconCirclePlus {...iconStyles} />
      </Button>
    </>
  );
};

export default AddResultModal;
