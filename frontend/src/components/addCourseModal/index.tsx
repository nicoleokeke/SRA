import { Button, Group, Modal, TextInput, rem } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCirclePlus } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { BACKEND_URL } from '../../constant';

const schema = z.object({
  courseName: z.string().min(2, 'Course name is too short'),
});

const iconStyles = { style: { width: rem(20), height: rem(20) }, stroke: 1.5 };
const AddCourseModal = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values: typeof form.values) =>
      fetch(`${BACKEND_URL}/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      }),
    onSuccess: async (res, values) => {
      await queryClient.invalidateQueries({ queryKey: ['courses/get'] });
      if (!res.ok) {
        return notifications.show({
          title: 'Error',
          message: 'Failed to add course, please try again',
          color: 'red',
        });
      }

      notifications.show({
        title: 'Course added',
        message: `${values.courseName} added to the list`,
      });
      close();
      form.reset();
    },
    onError: () => {
      notifications.show({
        title: 'Error',
        message: 'Failed to add course, please try again',
        color: 'red',
      });
    },
  });
  const [opened, { open, close }] = useDisclosure(false);
  const form = useForm({
    initialValues: {
      courseName: '',
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
        title="Add new course"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Course Name"
            placeholder="Please enter your course name"
            withAsterisk
            {...form.getInputProps('courseName')}
          />

          <Group justify="flex-end" mt="md">
            <Button type="submit">Submit</Button>
          </Group>
        </form>
      </Modal>

      <Button
        onClick={open}
        leftSection={<IconCirclePlus {...iconStyles} />}
        visibleFrom="md"
        loading={mutation.status === 'pending'}
      >
        Add New Course
      </Button>

      <Button
        onClick={open}
        hiddenFrom="md"
        loading={mutation.status === 'pending'}
      >
        <IconCirclePlus {...iconStyles} />
      </Button>
    </>
  );
};

export default AddCourseModal;
