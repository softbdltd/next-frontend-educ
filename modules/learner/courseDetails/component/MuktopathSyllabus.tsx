import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArticleIcon from '@mui/icons-material/Article';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import QuizIcon from '@mui/icons-material/Quiz';
import {Box} from '@mui/material';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {Fragment, useState} from 'react';
import {Body1} from '../../../../@core/elements/common';
import ChatIcon from '@mui/icons-material/Chat';

export default function MuktopathSyllabusComponent({syllabus}: any) {
  const [selectedItem, setSelectedItem] = useState<number>(-1);
  const [open, setOpen] = useState<boolean>(false);

  const handleClick = (id: number) => {
    setSelectedItem(id);
    setOpen(!open);
  };

  return (
    <List
      sx={{width: '100%', maxWidth: 600, bgcolor: 'background.paper'}}
      component='nav'
      aria-labelledby='nested-list-subheader'>
      {syllabus?.map((module: any) => (
        <Fragment key={module?.id}>
          <ListItemButton
            onClick={() => handleClick(module?.id)}
            sx={{background: '#ebebeb', borderBottom: '3px solid #ddd'}}>
            <ListItemText primary={module?.title} />
            {selectedItem == module?.id && open ? (
              <ExpandLess />
            ) : (
              <ExpandMore />
            )}
          </ListItemButton>
          <Collapse
            in={selectedItem == module?.id && open}
            timeout='auto'
            unmountOnExit>
            <List component='div' disablePadding>
              {module?.lessons?.map((lesson: any) => (
                <ListItemButton sx={{pl: 4}} key={lesson?.id}>
                  <ListItemIcon>
                    {lesson?.content?.content_type == 'video' && (
                      <OndemandVideoIcon />
                    )}
                    {lesson?.content?.content_type == 'document' && (
                      <ArticleIcon />
                    )}
                    {lesson?.content?.content_type == 'quiz' && <QuizIcon />}
                    {lesson?.content?.content_type == 'discussion' && (
                      <ChatIcon />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={lesson?.title}
                    secondary={
                      <SecondaryComponent
                        duration={lesson?.content?.duration}
                      />
                    }
                  />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        </Fragment>
      ))}
    </List>
  );
}

const SecondaryComponent = ({duration}: any) => {
  const formatContentDuration = (timeString: string) => {
    if (!timeString) {
      return '';
    }

    const [hours, minutes] = timeString.split(':');

    const formattedHours = Number(hours) > 0 ? `${parseInt(hours, 10)}:` : '';
    const formattedMinutes =
      Number(minutes) < 10 ? `0${Number(minutes)}` : parseInt(minutes, 10);

    return `${formattedHours}${formattedMinutes}:00`;
  };

  return (
    <Box sx={{display: 'flex', placeItems: 'center'}}>
      <AccessTimeIcon sx={{mr: '4px', fontSize: '18px'}} />{' '}
      <Body1 sx={{fontSize: '1rem !important'}}>
        {formatContentDuration(duration)}
      </Body1>
    </Box>
  );
};
