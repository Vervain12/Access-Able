import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )


  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const pathname = request.nextUrl.pathname;

    const protectedApiRoutes = [
      '/api/user',
      '/api/reviews/location/PostLocationReview',
      '/api/reviews/location/UploadReviewImages',
    ];

    const protectedPageRoutes = [
      '/profile',
      '/reviews',
      '/suggestions',
    ];

    const isApi = pathname.startsWith('/api/');
    const matchesProtectedApi = protectedApiRoutes.some(route => pathname.startsWith(route));
    const matchesProtectedPage = protectedPageRoutes.some(route => pathname.startsWith(route));

    if (isApi && matchesProtectedApi) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (matchesProtectedPage) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth';
      return NextResponse.redirect(url);
    }
  }


  return supabaseResponse
}