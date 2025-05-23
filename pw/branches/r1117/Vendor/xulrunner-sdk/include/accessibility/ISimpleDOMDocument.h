

/* this ALWAYS GENERATED file contains the definitions for the interfaces */


 /* File created by MIDL compiler version 7.00.0499 */
/* at Tue Jul 07 22:31:24 2009
 */
/* Compiler settings for e:/builds/moz2_slave/mozilla-1.9.1-win32-xulrunner/build/accessible/public/msaa/ISimpleDOMDocument.idl:
    Oicf, W1, Zp8, env=Win32 (32b run)
    protocol : dce , ms_ext, c_ext, robust
    error checks: allocation ref bounds_check enum stub_data 
    VC __declspec() decoration level: 
         __declspec(uuid()), __declspec(selectany), __declspec(novtable)
         DECLSPEC_UUID(), MIDL_INTERFACE()
*/
//@@MIDL_FILE_HEADING(  )

#pragma warning( disable: 4049 )  /* more than 64k source lines */


/* verify that the <rpcndr.h> version is high enough to compile this file*/
#ifndef __REQUIRED_RPCNDR_H_VERSION__
#define __REQUIRED_RPCNDR_H_VERSION__ 475
#endif

#include "rpc.h"
#include "rpcndr.h"

#ifndef __RPCNDR_H_VERSION__
#error this stub requires an updated version of <rpcndr.h>
#endif // __RPCNDR_H_VERSION__

#ifndef COM_NO_WINDOWS_H
#include "windows.h"
#include "ole2.h"
#endif /*COM_NO_WINDOWS_H*/

#ifndef __ISimpleDOMDocument_h__
#define __ISimpleDOMDocument_h__

#if defined(_MSC_VER) && (_MSC_VER >= 1020)
#pragma once
#endif

/* Forward Declarations */ 

#ifndef __ISimpleDOMDocument_FWD_DEFINED__
#define __ISimpleDOMDocument_FWD_DEFINED__
typedef interface ISimpleDOMDocument ISimpleDOMDocument;
#endif 	/* __ISimpleDOMDocument_FWD_DEFINED__ */


/* header files for imported files */
#include "objidl.h"
#include "oaidl.h"

#ifdef __cplusplus
extern "C"{
#endif 


/* interface __MIDL_itf_ISimpleDOMDocument_0000_0000 */
/* [local] */ 

///////////////////////////////////////////////////////////////////////////////////////////////////////
//
// ISimpleDOMDocument
//
// @STATUS UNDER_REVIEW
// ---------------------------------------------------------------------------------------------------=
//
// get_URL(out] BSTR *url)
// ---------------------------------------------------------------------------------------------------=
// Get the internet URL associated with this document.
//
// get_title([out BSTR *title
// ---------------------------------------------------------------------------------------------------=
// Get the document's title from the <TITLE> element
//
// get_mimeType([out BSTR *mimeType
// ---------------------------------------------------------------------------------------------------=
// Get the registered mime type, such as text/html
//
// get_docType([out] BSTR *docType
// ---------------------------------------------------------------------------------------------------=
// Get doctype associated with the <!DOCTYPE ..> element
//
// get_nameSpaceURIForID([in] short nameSpaceID, [out] BSTR *nameSpaceURI)
// ---------------------------------------------------------------------------------------------------=
// Some of the methods for ISimpleDOMNode return a nameSpaceID (-1,0,1,2,3,....)
// This method returns the associated namespace URI for each ID.
//
// set_alternateViewMediaTypes([in] BSTR *commaSeparatedMediaType)
// ---------------------------------------------------------------------------------------------------=
// For style property retrieval on nsISimpleDOMNode elements, 
// set the additional alternate media types that properties are available for.
// [in] BSTR *commaSeparatedMediaTypes is a comma separate list, for example "aural, braille".
// The alternate media properties are requested with nsISimpleDOMNode::get_computedStyle.
// Note: setting this value on a document will increase memory overhead, and may create a small delay.
//
// W3C media Types:
// * all:        Suitable for all devices. 
// * aural:      Intended for speech synthesizers. See the section on aural style sheets for details. 
// * braille:    Intended for braille tactile feedback devices. 
// * embossed:   Intended for paged braille printers. 
// * handheld:   Intended for handheld devices - typically small screen, monochrome, limited bandwidth. 
// * print:      Intended for paged, opaque material and for documents viewed on screen in print preview mode. Please consult the section on paged media for information about formatting issues that are specific to paged media. 
// * projection: Intended for projected presentations, for example projectors or print to transparencies. Please consult the section on paged media for information about formatting issues that are specific to paged media. 
// * screen:     Intended primarily for color computer screens. 
// * tty:        intended for media using a fixed-pitch character grid, such as teletypes, terminals, or portable devices with limited display capabilities. Authors should not use pixel units with the tty media type. 
// * tv:         Intended for television-type devices - low resolution, color, limited-scrollability screens, sound
// * See latest W3C CSS specs for complete list of media types
//
//
///////////////////////////////////////////////////////////////////////////////////////////////////////




extern RPC_IF_HANDLE __MIDL_itf_ISimpleDOMDocument_0000_0000_v0_0_c_ifspec;
extern RPC_IF_HANDLE __MIDL_itf_ISimpleDOMDocument_0000_0000_v0_0_s_ifspec;

#ifndef __ISimpleDOMDocument_INTERFACE_DEFINED__
#define __ISimpleDOMDocument_INTERFACE_DEFINED__

/* interface ISimpleDOMDocument */
/* [uuid][object] */ 


EXTERN_C const IID IID_ISimpleDOMDocument;

#if defined(__cplusplus) && !defined(CINTERFACE)
    
    MIDL_INTERFACE("0D68D6D0-D93D-4d08-A30D-F00DD1F45B24")
    ISimpleDOMDocument : public IUnknown
    {
    public:
        virtual /* [propget] */ HRESULT STDMETHODCALLTYPE get_URL( 
            /* [retval][out] */ BSTR *url) = 0;
        
        virtual /* [propget] */ HRESULT STDMETHODCALLTYPE get_title( 
            /* [retval][out] */ BSTR *title) = 0;
        
        virtual /* [propget] */ HRESULT STDMETHODCALLTYPE get_mimeType( 
            /* [retval][out] */ BSTR *mimeType) = 0;
        
        virtual /* [propget] */ HRESULT STDMETHODCALLTYPE get_docType( 
            /* [retval][out] */ BSTR *docType) = 0;
        
        virtual /* [propget] */ HRESULT STDMETHODCALLTYPE get_nameSpaceURIForID( 
            /* [in] */ short nameSpaceID,
            /* [retval][out] */ BSTR *nameSpaceURI) = 0;
        
        virtual /* [propput] */ HRESULT STDMETHODCALLTYPE put_alternateViewMediaTypes( 
            /* [in] */ BSTR *commaSeparatedMediaTypes) = 0;
        
    };
    
#else 	/* C style interface */

    typedef struct ISimpleDOMDocumentVtbl
    {
        BEGIN_INTERFACE
        
        HRESULT ( STDMETHODCALLTYPE *QueryInterface )( 
            ISimpleDOMDocument * This,
            /* [in] */ REFIID riid,
            /* [iid_is][out] */ 
            __RPC__deref_out  void **ppvObject);
        
        ULONG ( STDMETHODCALLTYPE *AddRef )( 
            ISimpleDOMDocument * This);
        
        ULONG ( STDMETHODCALLTYPE *Release )( 
            ISimpleDOMDocument * This);
        
        /* [propget] */ HRESULT ( STDMETHODCALLTYPE *get_URL )( 
            ISimpleDOMDocument * This,
            /* [retval][out] */ BSTR *url);
        
        /* [propget] */ HRESULT ( STDMETHODCALLTYPE *get_title )( 
            ISimpleDOMDocument * This,
            /* [retval][out] */ BSTR *title);
        
        /* [propget] */ HRESULT ( STDMETHODCALLTYPE *get_mimeType )( 
            ISimpleDOMDocument * This,
            /* [retval][out] */ BSTR *mimeType);
        
        /* [propget] */ HRESULT ( STDMETHODCALLTYPE *get_docType )( 
            ISimpleDOMDocument * This,
            /* [retval][out] */ BSTR *docType);
        
        /* [propget] */ HRESULT ( STDMETHODCALLTYPE *get_nameSpaceURIForID )( 
            ISimpleDOMDocument * This,
            /* [in] */ short nameSpaceID,
            /* [retval][out] */ BSTR *nameSpaceURI);
        
        /* [propput] */ HRESULT ( STDMETHODCALLTYPE *put_alternateViewMediaTypes )( 
            ISimpleDOMDocument * This,
            /* [in] */ BSTR *commaSeparatedMediaTypes);
        
        END_INTERFACE
    } ISimpleDOMDocumentVtbl;

    interface ISimpleDOMDocument
    {
        CONST_VTBL struct ISimpleDOMDocumentVtbl *lpVtbl;
    };

    

#ifdef COBJMACROS


#define ISimpleDOMDocument_QueryInterface(This,riid,ppvObject)	\
    ( (This)->lpVtbl -> QueryInterface(This,riid,ppvObject) ) 

#define ISimpleDOMDocument_AddRef(This)	\
    ( (This)->lpVtbl -> AddRef(This) ) 

#define ISimpleDOMDocument_Release(This)	\
    ( (This)->lpVtbl -> Release(This) ) 


#define ISimpleDOMDocument_get_URL(This,url)	\
    ( (This)->lpVtbl -> get_URL(This,url) ) 

#define ISimpleDOMDocument_get_title(This,title)	\
    ( (This)->lpVtbl -> get_title(This,title) ) 

#define ISimpleDOMDocument_get_mimeType(This,mimeType)	\
    ( (This)->lpVtbl -> get_mimeType(This,mimeType) ) 

#define ISimpleDOMDocument_get_docType(This,docType)	\
    ( (This)->lpVtbl -> get_docType(This,docType) ) 

#define ISimpleDOMDocument_get_nameSpaceURIForID(This,nameSpaceID,nameSpaceURI)	\
    ( (This)->lpVtbl -> get_nameSpaceURIForID(This,nameSpaceID,nameSpaceURI) ) 

#define ISimpleDOMDocument_put_alternateViewMediaTypes(This,commaSeparatedMediaTypes)	\
    ( (This)->lpVtbl -> put_alternateViewMediaTypes(This,commaSeparatedMediaTypes) ) 

#endif /* COBJMACROS */


#endif 	/* C style interface */




#endif 	/* __ISimpleDOMDocument_INTERFACE_DEFINED__ */


/* Additional Prototypes for ALL interfaces */

unsigned long             __RPC_USER  BSTR_UserSize(     unsigned long *, unsigned long            , BSTR * ); 
unsigned char * __RPC_USER  BSTR_UserMarshal(  unsigned long *, unsigned char *, BSTR * ); 
unsigned char * __RPC_USER  BSTR_UserUnmarshal(unsigned long *, unsigned char *, BSTR * ); 
void                      __RPC_USER  BSTR_UserFree(     unsigned long *, BSTR * ); 

/* end of Additional Prototypes */

#ifdef __cplusplus
}
#endif

#endif


