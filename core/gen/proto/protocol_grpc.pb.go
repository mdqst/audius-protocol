// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.4.0
// - protoc             v5.27.1
// source: protocol.proto

package proto

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.62.0 or later.
const _ = grpc.SupportPackageIsVersion8

const (
	Protocol_SubmitEvent_FullMethodName = "/protocol.Protocol/SubmitEvent"
	Protocol_GetEvent_FullMethodName    = "/protocol.Protocol/GetEvent"
)

// ProtocolClient is the client API for Protocol service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type ProtocolClient interface {
	SubmitEvent(ctx context.Context, in *SubmitEventRequest, opts ...grpc.CallOption) (*SubmitEventResponse, error)
	GetEvent(ctx context.Context, in *GetEventRequest, opts ...grpc.CallOption) (*GetEventResponse, error)
}

type protocolClient struct {
	cc grpc.ClientConnInterface
}

func NewProtocolClient(cc grpc.ClientConnInterface) ProtocolClient {
	return &protocolClient{cc}
}

func (c *protocolClient) SubmitEvent(ctx context.Context, in *SubmitEventRequest, opts ...grpc.CallOption) (*SubmitEventResponse, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(SubmitEventResponse)
	err := c.cc.Invoke(ctx, Protocol_SubmitEvent_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *protocolClient) GetEvent(ctx context.Context, in *GetEventRequest, opts ...grpc.CallOption) (*GetEventResponse, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(GetEventResponse)
	err := c.cc.Invoke(ctx, Protocol_GetEvent_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// ProtocolServer is the server API for Protocol service.
// All implementations must embed UnimplementedProtocolServer
// for forward compatibility
type ProtocolServer interface {
	SubmitEvent(context.Context, *SubmitEventRequest) (*SubmitEventResponse, error)
	GetEvent(context.Context, *GetEventRequest) (*GetEventResponse, error)
	mustEmbedUnimplementedProtocolServer()
}

// UnimplementedProtocolServer must be embedded to have forward compatible implementations.
type UnimplementedProtocolServer struct {
}

func (UnimplementedProtocolServer) SubmitEvent(context.Context, *SubmitEventRequest) (*SubmitEventResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method SubmitEvent not implemented")
}
func (UnimplementedProtocolServer) GetEvent(context.Context, *GetEventRequest) (*GetEventResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetEvent not implemented")
}
func (UnimplementedProtocolServer) mustEmbedUnimplementedProtocolServer() {}

// UnsafeProtocolServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to ProtocolServer will
// result in compilation errors.
type UnsafeProtocolServer interface {
	mustEmbedUnimplementedProtocolServer()
}

func RegisterProtocolServer(s grpc.ServiceRegistrar, srv ProtocolServer) {
	s.RegisterService(&Protocol_ServiceDesc, srv)
}

func _Protocol_SubmitEvent_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(SubmitEventRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ProtocolServer).SubmitEvent(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Protocol_SubmitEvent_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ProtocolServer).SubmitEvent(ctx, req.(*SubmitEventRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Protocol_GetEvent_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetEventRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ProtocolServer).GetEvent(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Protocol_GetEvent_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ProtocolServer).GetEvent(ctx, req.(*GetEventRequest))
	}
	return interceptor(ctx, in, info, handler)
}

// Protocol_ServiceDesc is the grpc.ServiceDesc for Protocol service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var Protocol_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "protocol.Protocol",
	HandlerType: (*ProtocolServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "SubmitEvent",
			Handler:    _Protocol_SubmitEvent_Handler,
		},
		{
			MethodName: "GetEvent",
			Handler:    _Protocol_GetEvent_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "protocol.proto",
}
