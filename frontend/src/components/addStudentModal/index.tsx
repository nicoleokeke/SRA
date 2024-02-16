import { Button, Group, Modal, TextInput, rem } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm, zodResolver } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCirclePlus } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { BACKEND_URL } from '../../constant';

const now = new Date();
// 10 years ago
const minimumDate = new Date(
  now.getFullYear() - 10,
  now.getMonth(),
  now.getDate(),
);
const schema = z.object({
  firstName: z.string().min(2, 'First name is too short'),
  familyName: z.string().min(2, 'Family name is too short'),
  dateOfBirth: z
    .date({
      invalid_type_error: 'Please enter a valid date',
      required_error: 'Date of birth is required',
    })
    .max(minimumDate, { message: 'Student must be at least 10 years old' }),
});

const iconStyles = { style: { width: rem(20), height: rem(20) }, stroke: 1.5 };
const AddStudentModal = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values: typeof form.values) =>
      fetch(`${BACKEND_URL}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      }),
    onSuccess: async (res, values) => {
      await queryClient.invalidateQueries({ queryKey: ['students/get'] });
      if (!res.ok) {
        return notifications.show({
          title: 'Error',
          message: 'Failed to add student, please try again',
          color: 'red',
        });
      }

      notifications.show({
        title: 'Student added',
        message: `${values.firstName} added to the list`,
      });
      close();
      form.reset();
    },
    onError: () => {
      notifications.show({
        title: 'Error',
        message: 'Failed to add student, please try again',
        color: 'red',
      });
    },
  });
  const [opened, { open, close }] = useDisclosure(false);
  const form = useForm({
    initialValues: {
      firstName: '',
      familyName: '',
      dateOfBirth: '',
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
        title="Add new student"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="First Name"
            placeholder="Please enter your first name"
            withAsterisk
            {...form.getInputProps('firstName')}
          />
          <TextInput
            label="Family Name"
            placeholder="Please enter your family name"
            withAsterisk
            {...form.getInputProps('familyName')}
          />
          <DateInput
            label="Date of Birth"
            placeholder="Please enter your date of birth"
            withAsterisk
            {...form.getInputProps('dateOfBirth')}
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
        Add New Student
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

export default AddStudentModal;
