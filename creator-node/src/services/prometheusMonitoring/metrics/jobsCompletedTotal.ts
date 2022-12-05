import { Gauge } from 'prom-client'

export default {
  metricType: Gauge,
  metricLabels: {
    queue_name: [] as readonly string[],
    job_name: [] as readonly string[]
  },
  metricConfig: {
    help: 'Number of completed jobs',
    aggregator: 'first'
  }
} as const
