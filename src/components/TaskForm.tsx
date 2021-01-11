import React from 'react';
import {
  Typography, Form, Input, Button, Select, DatePicker,
} from 'antd';
import moment, { Moment } from 'moment';
import { ITask } from '../api';

type CustomInputProps = {
  value?: string;
  id?: string;
  onChange?: (event: React.ChangeEvent | string | number) => void
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 6, span: 16 },
};

const { Title } = Typography;

export const CustomInput = ({ value, id, onChange = () => {} }: CustomInputProps) => {
  switch (id) {
    case 'description': return <Input.TextArea value={value} onChange={onChange} rows={4} />;
    case 'plannedStartDate':
    case 'plannedEndDate':
    case 'startDate':
    case 'endDate': return (
      <DatePicker
        value={moment(value)}
        format="DD.MM.YYYY"
        allowClear={false}
        onChange={(newValue: Moment | null) => onChange(+moment(newValue))}
      />
    );
    case 'type': return (
      <Select
        value={value}
        placeholder={id}
        onChange={(newValue: string) => onChange(newValue)}
      >
        <Select.Option value="default">Default</Select.Option>
        <Select.Option value="urgent">Urgent</Select.Option>
        <Select.Option value="outdated">Outdated</Select.Option>
      </Select>
    );
    default: return <Input value={value} onChange={onChange} />;
  }
};

interface IProps {
  title: string,
  task: ITask,
  onFinish: (data: ITask) => void
}

export default ({ title, onFinish, task }: IProps) => (
  <div className="TaskForm">
    <Title level={2}>{title}</Title>
    <Form
      {...layout}
      onFinish={onFinish}
    >
      {task && Object.entries(task)
        .filter(([key]) => key !== 'id')
        .map(([key, value]: [key:string, value: string]) => (
          <Form.Item
            name={key}
            label={key}
            key={key}
            initialValue={value}
            rules={[
              {
                required: key === 'title',
                message: `Please input ${key}`,
              },
            ]}
          >
            <CustomInput />
          </Form.Item>
        ))}
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  </div>
);
