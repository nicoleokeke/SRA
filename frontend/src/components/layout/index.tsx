import { AppShell, Burger, Group, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconBellRinging,
  IconFingerprint,
  IconKey,
  IconReceipt2,
  Icon,
} from '@tabler/icons-react';
import { Outlet, useMatch } from 'react-router-dom';
import classes from './index.module.css';

interface Data {
  link: string;
  label: string;
  icon: Icon;
}

const data: Data[] = [
  { link: '/', label: 'Home', icon: IconBellRinging },
  { link: '/student', label: 'Students', icon: IconReceipt2 },
  { link: '/course', label: 'Courses', icon: IconFingerprint },
  { link: '/result', label: 'Results', icon: IconKey },
];

const LinkItem = ({ label, icon: Icon, link }: Data) => {
  const match = useMatch(link);

  return (
    <a
      className={classes.link}
      data-active={match != null}
      href={link}
      key={label}
    >
      <Icon className={classes.linkIcon} stroke={1.5} />
      <span>{label}</span>
    </a>
  );
};

export function Layout() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Title>SRA</Title>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">{data.map(LinkItem)}</AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
