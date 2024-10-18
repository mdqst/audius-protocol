# Generated by the gRPC Python protocol compiler plugin. DO NOT EDIT!
"""Client and server classes corresponding to protobuf-defined services."""
import grpc
import warnings

import protocol_pb2 as protocol__pb2

GRPC_GENERATED_VERSION = '1.67.0'
GRPC_VERSION = grpc.__version__
_version_not_supported = False

try:
    from grpc._utilities import first_version_is_lower
    _version_not_supported = first_version_is_lower(GRPC_VERSION, GRPC_GENERATED_VERSION)
except ImportError:
    _version_not_supported = True

if _version_not_supported:
    raise RuntimeError(
        f'The grpc package installed is at version {GRPC_VERSION},'
        + f' but the generated code in protocol_pb2_grpc.py depends on'
        + f' grpcio>={GRPC_GENERATED_VERSION}.'
        + f' Please upgrade your grpc module to grpcio>={GRPC_GENERATED_VERSION}'
        + f' or downgrade your generated code using grpcio-tools<={GRPC_VERSION}.'
    )


class ProtocolStub(object):
    """Missing associated documentation comment in .proto file."""

    def __init__(self, channel):
        """Constructor.

        Args:
            channel: A grpc.Channel.
        """
        self.SendTransaction = channel.unary_unary(
                '/protocol.Protocol/SendTransaction',
                request_serializer=protocol__pb2.SendTransactionRequest.SerializeToString,
                response_deserializer=protocol__pb2.TransactionResponse.FromString,
                _registered_method=True)
        self.GetTransaction = channel.unary_unary(
                '/protocol.Protocol/GetTransaction',
                request_serializer=protocol__pb2.GetTransactionRequest.SerializeToString,
                response_deserializer=protocol__pb2.TransactionResponse.FromString,
                _registered_method=True)
        self.GetBlock = channel.unary_unary(
                '/protocol.Protocol/GetBlock',
                request_serializer=protocol__pb2.GetBlockRequest.SerializeToString,
                response_deserializer=protocol__pb2.BlockResponse.FromString,
                _registered_method=True)
        self.GetNodeInfo = channel.unary_unary(
                '/protocol.Protocol/GetNodeInfo',
                request_serializer=protocol__pb2.GetNodeInfoRequest.SerializeToString,
                response_deserializer=protocol__pb2.NodeInfoResponse.FromString,
                _registered_method=True)
        self.Ping = channel.unary_unary(
                '/protocol.Protocol/Ping',
                request_serializer=protocol__pb2.PingRequest.SerializeToString,
                response_deserializer=protocol__pb2.PingResponse.FromString,
                _registered_method=True)


class ProtocolServicer(object):
    """Missing associated documentation comment in .proto file."""

    def SendTransaction(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def GetTransaction(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def GetBlock(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def GetNodeInfo(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def Ping(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')


def add_ProtocolServicer_to_server(servicer, server):
    rpc_method_handlers = {
            'SendTransaction': grpc.unary_unary_rpc_method_handler(
                    servicer.SendTransaction,
                    request_deserializer=protocol__pb2.SendTransactionRequest.FromString,
                    response_serializer=protocol__pb2.TransactionResponse.SerializeToString,
            ),
            'GetTransaction': grpc.unary_unary_rpc_method_handler(
                    servicer.GetTransaction,
                    request_deserializer=protocol__pb2.GetTransactionRequest.FromString,
                    response_serializer=protocol__pb2.TransactionResponse.SerializeToString,
            ),
            'GetBlock': grpc.unary_unary_rpc_method_handler(
                    servicer.GetBlock,
                    request_deserializer=protocol__pb2.GetBlockRequest.FromString,
                    response_serializer=protocol__pb2.BlockResponse.SerializeToString,
            ),
            'GetNodeInfo': grpc.unary_unary_rpc_method_handler(
                    servicer.GetNodeInfo,
                    request_deserializer=protocol__pb2.GetNodeInfoRequest.FromString,
                    response_serializer=protocol__pb2.NodeInfoResponse.SerializeToString,
            ),
            'Ping': grpc.unary_unary_rpc_method_handler(
                    servicer.Ping,
                    request_deserializer=protocol__pb2.PingRequest.FromString,
                    response_serializer=protocol__pb2.PingResponse.SerializeToString,
            ),
    }
    generic_handler = grpc.method_handlers_generic_handler(
            'protocol.Protocol', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))
    server.add_registered_method_handlers('protocol.Protocol', rpc_method_handlers)


 # This class is part of an EXPERIMENTAL API.
class Protocol(object):
    """Missing associated documentation comment in .proto file."""

    @staticmethod
    def SendTransaction(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(
            request,
            target,
            '/protocol.Protocol/SendTransaction',
            protocol__pb2.SendTransactionRequest.SerializeToString,
            protocol__pb2.TransactionResponse.FromString,
            options,
            channel_credentials,
            insecure,
            call_credentials,
            compression,
            wait_for_ready,
            timeout,
            metadata,
            _registered_method=True)

    @staticmethod
    def GetTransaction(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(
            request,
            target,
            '/protocol.Protocol/GetTransaction',
            protocol__pb2.GetTransactionRequest.SerializeToString,
            protocol__pb2.TransactionResponse.FromString,
            options,
            channel_credentials,
            insecure,
            call_credentials,
            compression,
            wait_for_ready,
            timeout,
            metadata,
            _registered_method=True)

    @staticmethod
    def GetBlock(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(
            request,
            target,
            '/protocol.Protocol/GetBlock',
            protocol__pb2.GetBlockRequest.SerializeToString,
            protocol__pb2.BlockResponse.FromString,
            options,
            channel_credentials,
            insecure,
            call_credentials,
            compression,
            wait_for_ready,
            timeout,
            metadata,
            _registered_method=True)

    @staticmethod
    def GetNodeInfo(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(
            request,
            target,
            '/protocol.Protocol/GetNodeInfo',
            protocol__pb2.GetNodeInfoRequest.SerializeToString,
            protocol__pb2.NodeInfoResponse.FromString,
            options,
            channel_credentials,
            insecure,
            call_credentials,
            compression,
            wait_for_ready,
            timeout,
            metadata,
            _registered_method=True)

    @staticmethod
    def Ping(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(
            request,
            target,
            '/protocol.Protocol/Ping',
            protocol__pb2.PingRequest.SerializeToString,
            protocol__pb2.PingResponse.FromString,
            options,
            channel_credentials,
            insecure,
            call_credentials,
            compression,
            wait_for_ready,
            timeout,
            metadata,
            _registered_method=True)
