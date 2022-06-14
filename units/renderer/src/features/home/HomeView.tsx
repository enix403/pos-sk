import React from 'react';

import { NavPageView } from '@/layout/views';
import {
  Tag,
  Card
} from '@blueprintjs/core';


export const HomeView = () => {
  return (
    <NavPageView title="Home">
      <Card elevation={2} style={{ margin: "15px 25px" }}>
        Welcome
      </Card>
    </NavPageView>
  )
}
