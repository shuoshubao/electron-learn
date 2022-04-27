/*
 * @Author: shuoshubao
 * @Date:   2022-04-22 15:53:59
 * @Last Modified by:   shuoshubao
 * @Last Modified time: 2022-04-24 14:31:24
 * @Desc: 文件上传
 */
import React, { useRef, useState, useEffect } from 'react'
import { ipcRenderer } from 'electron'
import { Modal, Card, Button, Typography, message } from 'antd'
import { some } from 'lodash'
import { formatTime } from '@nbfe/tools'
import Table from '@ke/table'
import Form from '@ke/form'
import { TestBucketInfo, getTableColumns, getFormColumns, References } from './config'

const { Link } = Typography

const Index = () => {
  const formRef = useRef()
  const tableRef = useRef()

  const [modalData, setModalData] = useState({
    visible: false,
    adction: '',
    data: null
  })

  useEffect(() => {
    tableRef.current.search()
  }, [])

  const handleSubmit = async () => {
    const isAdd = modalData.action === 'add'
    const formData = await formRef.current.getFormData()
    if (!formData) {
      return
    }
    const { bucket } = formData
    const buckets = ipcRenderer.sendSync('getStore', 'buckets')
    const format = 'YYYY-MM-DD hh:mm:ss'
    if (isAdd) {
      if (some([...buckets, ...TestBucketInfo], { bucket })) {
        return message.error(`bucket【${bucket}】 已存在, 不可重复添加`)
      }
      buckets.unshift({
        ...formData,
        cTime: formatTime(Date.now(), format),
        mTime: null
      })
    } else {
      buckets.forEach(v => {
        if (v.bucket === bucket) {
          Object.assign(v, formData, {
            mTime: formatTime(Date.now(), format)
          })
        }
      })
    }
    ipcRenderer.send('setStore', 'buckets', buckets)
    setModalData({ visible: false })
    tableRef.current.search()
  }

  return (
    <>
      <Table
        ref={tableRef}
        rowKey="bucket"
        columns={getTableColumns({ setModalData })}
        remoteConfig={{
          fetch: async () => {
            const buckets = ipcRenderer.sendSync('getStore', 'buckets')
            return {
              list: [...buckets, TestBucketInfo]
            }
          }
        }}
        pagination={false}
        prependHeader={
          <Button
            type="primary"
            onClick={() => {
              setModalData({ visible: true, action: 'add', data: null })
            }}
          >
            新增Bucket
          </Button>
        }
      />
      <Card title="贝壳S3" size="small" className="mgt10">
        {References.map(v => {
          const { text, href } = v
          return (
            <div key={href}>
              <span>{text}
:
{' '}
</span>
              <Link href={href}>{href}</Link>
            </div>
          )
        })}
      </Card>
      <Modal
        visible={modalData.visible}
        title={modalData.action === 'add' ? '新增' : '编辑'}
        destroyOnClose
        width={600}
        onOk={handleSubmit}
        onCancel={() => {
          setModalData({ visible: false })
        }}
      >
        <Form
          ref={formRef}
          columns={getFormColumns({ initialValues: modalData.data })}
          showResetBtn={false}
          formProps={{ layout: 'horizontal' }}
          labelWidth={120}
        />
      </Modal>
    </>
  )
}

Index.displayName = 'Bucket'

export default Index
